import glob from 'glob';
import {Hugo, Item} from 'alfred-hugo';

import {Project} from './types';

export class Projects {
    /**
     * Parse all projects
     *
     * @param {string} dir The projects directory
     * @param {Hugo} hugo Hugo instance
     */
    public static parseAll(dir: string, hugo: Hugo): Item[] {
        const projectFiles: string[] = glob.sync(`${dir}/*.sublime-project`);
        const items: Item[] = [];

        for (const projectFile of projectFiles) {
            const projectData = hugo.cacheFile(projectFile);

            // Parse project if changed
            projectData.on('change', (cache, file) => {
                const p = JSON.parse(file);

                if (p.hasOwnProperty('folders') === false) {
                    return;
                }

                let name: string | null = null;
                const paths = [];

                for (const folder of p.folders) {
                    if (folder.hasOwnProperty('path') === false || folder.path.length === 0) {
                        continue;
                    }

                    // Find project name
                    if (name === null && folder.hasOwnProperty('name')) {
                        name = folder.name;
                    }

                    paths.push(folder.path);
                }

                // Make sure it has a name and at least one path
                if (name === null || name.trim().length === 0 || paths.length === 0) {
                    return;
                }

                cache.set('uid', Buffer.from(file, 'utf8').toString('base64'));
                cache.set('file', projectFile);
                cache.set('name', name);
                cache.set('paths', paths);
            });

            const project: Project = projectData.get();

            // Make sure the project is valid
            if (project.hasOwnProperty('uid') === false) {
                continue;
            }

            items.push({
                uid: project.uid,
                title: project.name,
                subtitle: project.paths.join(', '),
                arg: this.openArgument(project, this.sublimeApp),
                valid: true,
                mods: {
                    alt: {
                        valid: true,
                        subtitle: 'Open project path(s) in terminal',
                        arg: this.openArgument(project, this.terminalApp),
                    },
                    cmd: {
                        valid: true,
                        subtitle: 'Open in new window',
                        arg: this.openArgument(project, this.sublimeApp, ['-n']),
                    },
                    ctrl: {
                        valid: true,
                        subtitle: 'Switch to project in last open window',
                        arg: this.openArgument(project, this.sublimeApp, ['-a']),
                    },
                    shift: {
                        valid: true,
                        subtitle: 'Open project path(s) in finder',
                        arg: this.openArgument(project, 'Finder'),
                    },
                },
            });
        }

        return items;
    }

    private static sublimeApp: string = process.env.sublimeApp
        || '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl';
    private static terminalApp: string = process.env.terminalApp
        || 'Terminal';

    /**
     * Open arguments
     *
     * @param {Project} project Sublime project
     * @param {string} app Application name
     * @param {Array.String} args Application arguments
     *
     * @return {string} Open command
     */
    private static openArgument(project: Project, app: string, args?: string[]): string {
        // Build shell command
        let command: string[] = [];

        if (app === this.sublimeApp) {
            command = [
                '"' + this.sublimeApp + '"',
                '--project',
                '"' + project.file + '"',
            ];

            // Append arguments
            if (args && args.length > 0) {
                command = command.concat(args);
            }
        } else {
            command = [
                'open',
                '-a',
                `'${app}'`,
                '"' + project.paths.join('" "') + '"',
            ];

            // Append arguments
            if (args && args.length > 0) {
                command.push('--args');
                command = command.concat(args);
            }
        }

        return command.join(' ');
    }
}

import untildify from 'untildify';
import {Hugo} from 'alfred-hugo';

import {Projects} from './projects';

const hugo = new Hugo({
    checkUpdates: true,
    updateNotification: false,
    updateSource: 'npm',
});

const projectsPath = untildify('~/Library/Application Support/Sublime Text 3/Packages/User/Projects');

hugo.action('projects', () => {
    const projects = Projects.parseAll(projectsPath, hugo);

    // Add all items
    hugo.items = hugo.items.concat(projects);

    // Check if any projects found
    if (hugo.items.length === 0) {
        hugo.items.push({
            title: 'No projects found.',
        });
    }

    // Output
    hugo.feedback();
});

hugo.run();

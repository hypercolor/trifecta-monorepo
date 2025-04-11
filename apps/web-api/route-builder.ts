import fs from 'node:fs/promises';
import {DefineRoutesFunction} from "remix-flat-routes";

async function routes(defineRoutes: DefineRoutesFunction) {
    const routes = await buildRoutesFromDirectory('./app/routes')

    return defineRoutes(route => {
        routes.forEach(({url, file}) => {
            route(url, file)
        });
    });
}

const buildRoutesFromDirectory = async (dir: string) => {
    const formattedRoutes: {
        url: string,
        file: string,
    }[] = [];

    const files = await fs.readdir(dir, {
        withFileTypes: true,
        recursive: true,
        encoding: 'utf-8',
    });

    files.filter(i => i.isFile()).forEach(file => {
        if (file.name === 'route.ts' || file.name === 'route.tsx') {
            const formatted = formatRoute((file as any).parentPath, file.name);
            formattedRoutes.push(formatted);
        }
    });

    return formattedRoutes;
};

const formatRoute = (dir: string, fileName: string) => {
    const formatted = {
        url: dir.replace('app/routes', '').replace(`/route.${fileName.split('.').pop()}`, ''),
        file: dir.replace('app/', '') + `/route.${fileName.split('.').pop()}`,
    };

    if (dir.includes('$')) {
        formatted.url = formatted.url.replace(/\$/g, ':'); // replace $ with : for dynamic routes
    }

    return formatted;
};

export default routes;

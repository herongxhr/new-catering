import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
// https://github.com/sorrycc/slash2
// Forward-slash paths can be used in Windows as long as they're not extended-length paths and don't contain any non-ascii characters.
// This was created since the path methods in Node outputs \\ paths on Windows.
import slash from 'slash2';

const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: {
                hmr: true,
            },
            locale: {
                enable: true,
                default: 'zh-CN',
                // default true, when it is true, will use `navigator.language` overwrite default
                baseNavigator: true,
            },
            dynamicImport: {
                //loadingComponent: './components/PageLoading/index',
                webpackChunkName: true,
            }
        }
    ]
]

export default {
    routes: pageRoutes,
    plugins,
    treeShaking: true,
    targets: {
        ie: 10
    },
    // Theme for antd
    // https://ant.design/docs/react/customize-theme-cn
    theme: {
        'primary': defaultSettings.primaryColor,
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    cssLoaderOptions: {
        modules: true,
        getLocalIdent: (context, localIdentName, localName) => {
            if (
                context.resourcePath.includes('node_modules') ||
                context.resourcePath.includes('ant.design.pro.less') ||
                context.resourcePath.includes('global.less')
            ) {
                return localName;
            }
            const match = context.resourcePath.match(/src(.*)/);
            // match[1]：子匹配的值
            if (match && match[1]) {
                const antdProPath = match[1].replace('.less', '');
                const arr = slash(antdProPath)
                    .split('/')
                    .map(a => a.replace(/([A-Z])/g, '-$1'))
                    .map(a => a.toLowerCase());
                return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
            }
            return localName;
        },
    },
}
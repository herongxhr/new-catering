export default [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        //Routes: ['src/pages/Authorized'],
        routes: [
            // 工作台
            { path: '/', redirect: '/index' },
            {
                path: '/index',
                name: '工作台',
                icon: 'dashboard',
                component: './Index'
            },
            {
                // 菜单中心
                path: '/menu-center',
                name: '菜单中心',
                icon: 'bars',
                routes: [
                    { path: '/menu-center', redirect: '/menu-center/menu-list'},
                    {
                        // 菜单列表
                        path: '/menu-center/menu-list',
                        component: './MenuCenter/MenuList',
                    },
                    {
                        // 模板卡片列表
                        path: '/menu-center/menu-template',
                        component: './MenuCenter/MenuTemplate',
                    },
                    {
                        // 统一菜单详情
                        path: '/menu-center/unified-menu/details',
                        component: './MenuCenter/MenuDetails',
                    },
                    {
                        // 我的菜单详情
                        path: '/menu-center/my-menu/details',
                        component: './MenuCenter/MenuDetails',
                    },
                    {
                        // 模板详情
                        path: '/menu-center/template/details',
                        component: './MenuCenter/TemplateDetails',
                    },
                    {
                        // 新建菜单
                        path: '/menu-center/my-menu/custom',
                        component: './MenuCenter/CustomMenu',
                    },
                    {
                        // 编辑菜单
                        path: '/menu-center/my-menu/update',
                        component: './MenuCenter/CustomMenu',
                    },
                    {
                        // 新建模板
                        path: '/menu-center/menu-template/custom',
                        component: './MenuCenter/CutomTemplate',
                    },
                    {
                        // 编辑模板
                        path: '/menu-center/menu-template/update',
                        component: './MenuCenter/CutomTemplate',
                    },
                ],
            },
            {
                // 辅料超市
                path: '/supermarket',
                name: '辅料超市',
                icon: 'shopping',
                component: './Supermarket'
            },
            {
                // 采购订单
                path: '/pur-order',
                name: '采购订单',
                icon: 'profile',
                routes: [
                    { path: '/pur-order', redirect: '/pur-order/list'},
                    {
                        // 列表页
                        path: '/pur-order/list',
                        component: './PurOrder/PurOrderList',
                    },
                    {
                        // 详情页
                        path: '/pur-order/details',
                        component: './PurOrder/PurOrderDetails',
                    },
                ],
            },
            {
                // 配送验收
                path: '/delivery-acceptance',
                name: '配送验收',
                icon: 'attr-catalog-manage',
                routes: [
                    { path: '/deliver-acceptance', redirect: '/deliver-acceptance/list'},
                    {
                        // 列表页
                        path: '/deliver-acceptance/list',
                        component: './DeliveryAcceptance/DeliveryAcceptanceList',
                    },
                    // {
                    //     // 详情页
                    //     path: '/deliver-acceptance/details',
                    //     component: './DeliveryAcceptance/DeliveryAcceptanceDetails',
                    // },
                ],
            },
            {
                // 台帐
                path: '/parameter',
                name: '台帐',
                icon: 'catalog-manage',
                routes: [
                    { path: '/parameter', redirect: '/parameter/list'},
                    {
                        // 列表页
                        path: '/parameter/list',
                        component: './Parameter/ParameterList',
                    },
                    {
                        // 详情页
                        path: '/parameter/details',
                        component: './Parameter/ParameterDetails',
                    },
                ],
            },
            // {
            //     component: '404',
            // },
        ],
    },
]
export default [
    {
        path: '/',
        component: '../layouts/BasicLayout',
        //Routes: ['src/pages/Authorized'],
        routes: [
            // 工作台
            { path: '/', redirect: '/home' },
            {
                path: '/home',
                name: 'home',
                icon: 'home',
                component: './Home/Home'
            },
            {
                // 菜单中心
                path: '/menu-center',
                name: 'menucenter',
                icon: 'bars',
                routes: [
                    { path: '/menu-center', redirect: '/menu-center/unified'},
                    {
                        // 统一菜单列表
                        path: '/menu-center/unified',
                        component: './MenuCenter/Unified',
                    },
                    {
                        // 我的菜单列表
                        path: '/menu-center/my',
                        component: './MenuCenter/My',
                    },
                    {
                        // 模板卡片列表
                        path: '/menu-center/template',
                        component: './MenuCenter/MenuTemplate',
                    },
                    {
                        // 统一菜单详情
                        path: '/menu-center/unified/details',
                        component: './MenuCenter/MenuDetails',
                    },
                    {
                        // 我的菜单详情
                        path: '/menu-center/my/details',
                        component: './MenuCenter/MenuDetails',
                    },
                    {
                        // 模板详情
                        path: '/menu-center/template/details',
                        component: './MenuCenter/TemplateDetails',
                    },
                    {
                        // 新建菜单
                        path: '/menu-center/my/custom',
                        component: './MenuCenter/CustomMenu',
                    },
                    {
                        // 编辑菜单
                        path: '/menu-center/my/update',
                        component: './MenuCenter/CustomMenu',
                    },
                    {
                        // 新建模板
                        path: '/menu-center/template/custom',
                        component: './MenuCenter/CustomTemplate',
                    },
                    {
                        // 编辑模板
                        path: '/menu-center/template/update',
                        component: './MenuCenter/CustomTemplate',
                    },
                ],
            },
            {
                // 辅料超市
                path: '/supermarket',
                name: 'supermarket',
                icon: 'shopping',
                component: './Supermarket/Supermarket'
            },
            {
                // 采购订单
                path: '/pur-order',
                name: 'purorder',
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
                    {
                        // 新建辅料订单页
                        path: '/pur-order/customF',
                        component: './PurOrder/PurOrderAdjust',
                    },
                    {
                        // 新建食材订单页
                        path: '/pur-order/customS',
                        component: './PurOrder/PurOrderAdjust',
                    },
                    {
                        // 调整页
                        path: '/pur-order/adjust',
                        component: './PurOrder/PurOrderAdjust',
                    },
                ],
            },
            {
                // 配送验收
                path: '/delivery-acceptance',
                name: 'deliveryacceptance',
                icon: 'bar-chart',
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
                name: 'parameter',
                icon: 'read',
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
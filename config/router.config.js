export default [
    // // user
    // {
    //     path: '/user',
    //     component: '../layouts/UserLayout',
    //     routes: [
    //         { path: '/user', redirect: '/user/login' },
    //         { path: '/user/login', name: 'login', component: './User/Login' },
    //         { path: '/user/register', name: 'register', component: './User/Register' },
    //         {
    //             path: '/user/register-result',
    //             name: 'register.result',
    //             component: './User/RegisterResult',
    //         },
    //     ],
    // },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        //Routes: ['src/pages/Authorized'],
        routes: [
            // dashboard
            { path: '/', redirect: '/dashboard' },
            {
                path: '/dashboard',
                name: '工作台',
                icon: 'dashboard',
            },
            {
                // 食材库
                path: '/food-material',
                name: '食材库',
                icon: 'food-material',
                routes: [
                    {
                        // 食材，默认页面
                        path: '/food-material',
                        component: './FoodMaterial/FoodMaterial',
                    },
                    {
                        // 食材，待审核页面
                        path: '/food-material/wait-confirm',
                        component: './FoodMaterial/MaterialWaitConfirm',
                    },
                    {
                        // 食材之食材规格信息
                        path: '/food-material/spec-info',
                        component: './FoodMaterial/SpecInfo',
                    },
                    {
                        // 食材之食材规格参数
                        path: '/food-material/material-details',
                        component: './FoodMaterial/MaterialDetails',
                    },
                    {
                        // 食材之食材详情
                        path: '/food-material/food-details',
                        component: './FoodMaterial/FoodDetails',
                    },
                    {
                        // 食材之新增与编辑
                        path: '/food-material/edit-material',
                        component: './FoodMaterial/EditMaterial',
                    },
                ],
            },
            {
                // 辅料
                path: '/dish-ingredients',
                name: '辅料库',
                icon: 'dish-ingredients',
                routes: [
                    {
                        // 默认页面
                        path: '/dish-ingredients',
                        component: './DishIngredients/DishIngredients',
                    },
                    {
                        // 待审核页面
                        path: '/dish-ingredients/wait-confirm',
                        component: './DishIngredients/IngredientsWaitConfirm',
                    },
                    {
                        // 新增或编辑
                        path: '/dish-ingredients/edit-ingredients',
                        component: './DishIngredients/EditIngredients',
                    },
                ],
            },
            {
                // 菜品库
                path: '/dish-library',
                name: '菜品库',
                icon: 'dish-library',
                routes: [
                    {
                        // 默认页
                        path: '/dish-library',
                        component: './DishLibrary/DishLibrary',
                    },
                    {
                        // 详情页
                        path: '/dish-library/dish-details',
                        component: './DishLibrary/DishDetails',
                    },
                    {
                        // 新增或编辑
                        path: '/dish-library/edit-dish',
                        component: './DishLibrary/EditDish',
                    },
                ],
            },
            {
                // 属性类目管得
                path: '/attr-catalog-manage',
                name: '属性类目',
                icon: 'attr-catalog-manage',
                routes: [
                    {
                        // 默认页面
                        path: '/attr-catalog-manage',
                        component: './AttrCatalogManage/AttrCatalogManage',
                    },
                ],
            },
            {
                // 类别管理
                path: '/catalog-manage',
                name: '类别管理',
                icon: 'catalog-manage',
                routes: [
                    {
                        // 默认页
                        path: '/catalog-manage',
                        component: './CatalogManage/CatalogManage',
                    },
                    {
                        // 辅料类别页
                        path: '/catalog-manage/ingredients',
                        component: './CatalogManage/Ingredients',
                    },
                ],
            },
            {
                // 品牌管理
                path: '/brand-manage',
                name: '品牌管理',
                icon: 'brand-manage',
                routes: [
                    {
                        // 品牌管理
                        path: '/brand-manage',
                        component: './BrandManage/BrandManage',
                    },
                ],
            },
            {
                // 模板管理
                path: '/template-manage',
                name: '菜单模板',
                icon: 'template-manage',
                routes: [
                    {
                        // 默认页面
                        path: '/template-manage',
                        component: './TemplateManage/TemplateManage',
                    },
                    {
                        // 新增或编辑
                        path: '/template-manage/edit-template',
                        component: './TemplateManage/EditTemplate',
                    },
                ],
            },
            // 帐户管理
            {
                name: '用户管理',
                icon: 'user',
                path: '/account',
                routes: [
                    {
                        // 默认页
                        path: '/account/center/',
                        component: './Account/Center',
                    },
                    {
                        // 管理单位
                        path: '/account/superior',
                        component: './Account/Superior',
                    },
                    {
                        // 餐饮单位
                        path: '/account/catering',
                        component: './Account/Catering',
                    },
                    {
                        // 供应商
                        path: '/account/center/supplier',
                        component: './Account/Supplier',
                    },
                ],
            },
            // {
            //     component: '404',
            // },
        ],
    },
]
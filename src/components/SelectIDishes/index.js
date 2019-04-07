import React from 'react';
import { Modal, Select, Input, Table, Tag } from 'antd';
import { router } from 'umi';
import styles from './index.module.less';

const { Search } = Input;
const { Option } = Select;

// 选菜/选食材弹出框中筛选下拉框的数据
const selectData = [
    ['', '全部'],
    ['HC', '荤菜'],
    ['SC', '素菜'],
    ['BH', '半荤'],
    ['TG', '汤羹'],
    ['QT', '其它'],
]

/**
 * 接收以下属性：
 * 1.isAdd：是否是加菜
 * 2.visible：modal是否可见
 * 3.dishesData：菜品数据
 * 4.zj：周几
 * 5.mealTimes：餐次
 * 6.currTDMeals：点击单元格中菜品数据
 * 7.handleHideModal：隐藏modal的方法
 * 8.getDishes：定义在父组件中请求菜品数据的方法
 * 9.changeArrangedMeals：对菜品进行选择/删除/替换的操作
 */
class SelectDishes extends React.Component {
    state = {
        type: '',
        keywords: '',
        current: 1,
        pageSize: 10
    }
    // 点击分类或搜索关键字搜索菜品
    filterToGetData = (params = {}) => {
        const { getDishes } = this.props;
        this.setState({ ...params });
        // 发请求
        getDishes({
            ...this.state,
            ...params
        });
    }

    // 查看详情
    handlePreviewItem = id => {
        router.push(`/dishDetails/${id}`);
    }

    componentDidMount() {
        this.filterToGetData();
    }
    render() {
        // 弹出框modal表头数据
        const tableColumns = [
            {
                title: '名称',
                dataIndex: 'foodName'
            },
            {
                title: '类别',
                dataIndex: 'type',
                render: type => {
                    return { HC: '荤菜', BH: '半荤', SC: '素菜', TG: '汤羹', QT: '其他' }[type];
                }
            },
            {
                title: '食材明细',
                dataIndex: 'gg',
            },
            {
                title: '图片',
                dataIndex: 'img',
                render: (_, record) => (
                    <a onClick={() => { }}>查看</a>
                )
            },
            {
                title: '操作',
                key: 'actions',
                width: 100,
                render: (_, record) => {
                    // 判断当前食材或菜品是否已经添加
                    // 当前是加菜还是换菜模式
                    let { isAdd, currTDMeals, changeArrangedMeals } = this.props;
                    let flag = isAdd ? 1 : 0;
                    return currTDMeals.some(item => item.foodId === record.id)
                        ? <span>已选</span>
                        : <a onClick={e => {
                            e.stopPropagation();
                            changeArrangedMeals(record, flag);
                        }}>选择</a>
                }
            },
        ];
        const {
            isAdd, // 是否加菜
            visible, // 控制显示与隐藏
            handleHideModal, // 隐藏modal的方法
            changeArrangedMeals, // 选菜，删菜，换菜方法
            dishesData, // 菜品数据
            currTDMeals, // 已选菜品数据
        } = this.props;
        const records = dishesData.records || [];
        const tagListDom = currTDMeals.map(item => (
            // 自己新增的绿色显示
            <Tag color={item.isAdd ? 'green' : ''}
                style={{
                    height: 32,
                    lineHeight: "32px",
                    fontSize: "14px",
                    marginBottom: 10
                }}
                key={item.foodId}
                // 判断是不是自己加的菜
                closable={item.isAdd}
                onClose={() => {
                    changeArrangedMeals(item, -1)
                }} >
                {item.viewFood.foodName}：{item.viewFood.gg && item.viewFood.gg.substring(0, 14) + '...'}
            </Tag>));
        return (
            <Modal
                wrapClassName={styles.selectDishes}
                width={1100}
                maskClosable={false}
                closable={false}
                title={isAdd ? '加菜' : "换菜"}
                visible={visible}
                okText="保存"
                onOk={handleHideModal}
                onCancel={handleHideModal}
            >
                <div className={styles.leftContent}>
                    <div className={styles.filterWrap}>
                        <label style={{ width: 42 }}>类别：
                            <Select
                                style={{ width: 170 }}
                                defaultValue={''}
                                onChange={value => this.filterToGetData({ type: value })}>
                                {selectData.map(([value, text]) =>
                                    <Option key={value} value={value}>{text}</Option>
                                )}
                            </Select>
                        </label>
                        <Search
                            placeholder="请输入关键字进行搜索"
                            onSearch={value => this.filterToGetData({ keywords: value })}
                            style={{ width: 190, marginLeft: 10 }}
                        />
                    </div>
                    <Table
                        style={{ height: 594 }}
                        columns={tableColumns}
                        dataSource={records}
                        onChange={({ current, pageSize }) => this.filterToGetData({ current, pageSize })}
                        rowKey="id"
                        onRow={record => {
                            return {
                                onClick: () => this.handlePreviewItem(record.id),
                            }
                        }}
                        pagination={{
                            current: dishesData.current || 1,
                            pageSize: dishesData.size || 10,
                            total: dishesData.total || 0,
                            showTotal: total => `共 ${total} 道菜`,
                            showQuickJumper: true
                        }}
                    />
                </div>
                <div className={styles.rightResult}>
                    <ul className={styles.tagList}>
                        {tagListDom}
                    </ul>
                </div>
            </Modal>
        )
    }
}

export default SelectDishes;


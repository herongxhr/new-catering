import React from 'react';
import { DatePicker, Radio } from 'antd';
import './index.less';

const { RangePicker } = DatePicker;
export default class FilterByDateAndStatus extends React.Component {
    render() {
        const {
            handleFilterChange,
            status,
        } = this.props;
        return (
            <div className="filter">
                <div style={{ float: "left", height: 32, }}>
                    <label>日期选择：
                    <RangePicker
                            style={{ width: 240 }}
                            onChange={(_, dateStrings) => {
                                let [startDate, endDate] = dateStrings;
                                handleFilterChange({
                                    startDate: `${startDate}00:00:00`,
                                    endDate: `${endDate}23:59:59`
                                })
                            }}
                        />
                    </label>
                </div>
                <span style={{ float: "right", height: 32 }}>
                    <Radio.Group defaultValue="" onChange={e => handleFilterChange({
                        status: e.target.value
                    })} >
                        <Radio.Button value="">{status[0]}</Radio.Button>
                        <Radio.Button value="0">{status[1]}</Radio.Button>
                        <Radio.Button value="1">{status[2]}</Radio.Button>
                    </Radio.Group>
                </span>
            </div >
        )
    }
}
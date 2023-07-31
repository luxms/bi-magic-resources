import React from "react";
import cn from 'classnames';
import ReactECharts from 'echarts-for-react';
import { MyService } from "../services/MyService";
import { urlState, UrlState } from "bi-internal/core";

export default class MyBarGraph extends React.Component<any> {
  private _myService: MyService;
  private _urlService: UrlState;
  public _chart: any = null;
  public state: {
    data: any;
    theme: any;
    option: any;
    table: boolean
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      theme: {},
      option: {},
      table: false
    };
  }

  public componentDidMount(): void {

    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource?.koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
    this._urlService = UrlState.getInstance()
    this._urlService.subscribeUpdatesAndNotify(this._onSrvcUpdated)
  }
  private _onSrvcUpdated = (model) => {
    if (model.loading || model.error) return;
    if (model.hasOwnProperty('table')) {
      this.setState({ table: !!model.table })
    }
    //  тут логика, где вы из модели урла берете ключ, который вы выставляете по клику на элемент (таб переклбючения). Допустим он зовется viewType и принимает 0 или 1 (график и таблица соответственно, по умолчанию 0, если не выставлен)
    // сохраняете это в стейт вашего компонента
  }
  private _onSvcUpdated = (model) => {
    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource?.koob || "oracle.orders_full";
    const filters = cfg.getRaw().dataSource?.filters || {};
    if (model.loading || model.error) return;
    this._myService.getKoobDataByCfg({
      with: koob,
      columns: [
        'sum(value):sum_value',
        'org_name'
      ],
      filters: {
        ...model.filters,
      }
    }).then(data => {
      console.log(data);
      this.setState({ data: data });
    })
  }
  public handleAlternative() {
    this._urlService.navigate({ table: String(!this.state.table) })
  }
  public render() {
    this.state.option = {
      xAxis: {
        type: 'category',
        data: [...this.state.data.map(el => el.org_name)],
        axisLabel: {
          fontSize: 10,
          align: 'center',
          hideOverlap: false
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [...this.state.data.map(el => el.sum_value)],
          type: 'bar',
          smooth: true
        }
      ],
      tooltip: {
        trigger: "axis"
      }
    }
    if (this.state.data.length === 0) return <div>Нет данных</div>

    const { data, theme } = this.state;
    return (

      <>
        {!this.state.table ?
          (<div className="ComponentWrapper MyCustomComponent">
            <ReactECharts option={this.state.option} />

          </div>) :
          (<table width='75%' style={{ border: ' 1px solid' }}>
            <tr>
              {data.map(el => <th style={{ padding: '10px' }}>{el.org_name}</th>)}
            </tr>
            <tr>
              {data.map(el => <td style={{ padding: '10px' }}>{el.sum_value}</td>)}
            </tr>
          </table>)}
        <button type='button' onClick={() => this.handleAlternative()}>Отобразить в альтернативном варианте</button>
      </>
    );
  }
}
import React from "react";
import { MyService } from "../services/MyService";

export default class MySelect extends React.Component<any> {
  private _myService: MyService;
  public _chart: any = null;
  public state: {
    data: any;
    theme: any;
    filters: any;
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      theme: {},
      filters: ['=']
    };
  }


  public componentDidMount(): void {
    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource.koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
  }

  private _onSvcUpdated = (model) => {
    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource.koob || "oracle.orders_full";
    const filters = cfg.getRaw().dataSource?.filters || {};
    if (model.loading || model.error) return;
    this.setState({ data: model.dictionaries })

    this.setState({ filters: [...this.state.filters, ...model.dictionaries.org_name.values] })

  }

  private handleChange(event) {
    const result = event.target.value
    if (event.target.checked) {
      this.setState((prev: any) => ({ ...prev, filters: [...prev.filters, result] }))
    } else {
      this.setState((prev: any) => ({ ...prev, filters: prev.filters.filter(el => el !== result) }))
    }
  }
  private handleSubmit() {
    this._myService.setFilters({ org_name: this.state.filters })
  }
  public render() {
    const { data } = this.state

    return (
      <div className="ComponentWrapper MyCustomComponent">
        {data.org_name?.values.map(el =>
          <div>
            <input id={el} type='checkbox' defaultChecked value={el} onChange={(e) => this.handleChange(e)} />
            <label htmlFor={el}>{el}</label>
          </div>
        )}
        <button type='button' onClick={() => this.handleSubmit()}>Подтвердить фильтры</button>
      </div>
    );
  }
}
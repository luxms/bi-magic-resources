import { AppConfig, BaseService, UrlState } from "bi-internal/core";
import axios from "axios";
// повторные фильтры будут срабатывать в течение этого времени
export interface IMyServiceModel {
  loading?: boolean;
  error?: string;
  data: any;
  filters: any;
  dictionaries: any;
}
export class MyService extends BaseService<IMyServiceModel> {
  private readonly id: string | number;
  private constructor(koobId: string) {
    super({
      loading: false,
      error: null,
      data: [],
      filters: {},
      dictionaries: {},
    });
    this.id = koobId;
    const dimensions = ["org_name"];
    Promise.all(
      dimensions.map((dim) =>
        fetch(`api/v3/koob/${koobId}.${dim}`).then((resp) => resp.json())
      )
    ).then((responses) => {
      console.log(responses);
      let dictionaries = {};
      dimensions.map((dim, i) => {
        if (!dictionaries.hasOwnProperty(dim)) {
          dictionaries[dim] = {
            title: responses[i].title,
            values: responses[i].values,
          };
        }
      });
      this._updateWithData({ dictionaries });
    });
  }
  public async getKoobDataByCfg(cfg): Promise<any> {
    const url: string = AppConfig.fixRequestUrl(`/api/v3/koob/data`);
    const columns = cfg.columns;

    let filters = {};
    if (cfg.filters) filters = { ...cfg.filters };
    const body: any = {
      with: cfg.with,
      columns,
      filters,
    };

    if (cfg.offset) body.offset = cfg.offset;
    if (cfg.limit) body.limit = cfg.limit;
    if (cfg.sort) body.sort = cfg.sort;
    if (cfg.options) body.options = cfg.options;
    if (cfg.subtotals?.length) body.subtotals = cfg.subtotals;

    if (cfg.distinct) {
      // если нет measures, то лучше применить distinct
      body.distinct = [];
    }

    try {
      const response = await axios({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/stream+json",
        },
        data: body,
        cancelToken: cfg.cancelToken,
      });

      let data = response.data;

      if (
        String(response.headers["content-type"]).startsWith(
          "application/stream+json"
        )
      ) {
        if (typeof data === "string") {
          data = data
            .split("\n")
            .filter((line: string) => !!line)
            .map((line: string) => JSON.parse(line));
        } else if (data && typeof data === "object" && !Array.isArray(data)) {
          data = [data];
        }
      }

      return data;
    } catch (e) {
      return "";
    }
  }
  public setFilters(filters) {
    this._updateWithData({ filters });
  }
  protected _dispose() {
    if (window.__myService && window.__myService[String(this.id)]) {
      delete window.__myService[String(this.id)];
    }
    super._dispose();
  }
  public static createInstance(id: string | number): MyService {
    if (!window.__myService) {
      window.__myService = {};
    }
    if (!window.__myService.hasOwnProperty(String(id))) {
      window.__myService[String(id)] = new MyService(String(id));
    }
    return window.__myService[String(id)];
  }
}

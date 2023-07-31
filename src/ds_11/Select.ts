import React, { useState, useEffect } from "react";
import { MyService } from "../services/MyService";

interface SelectProps {
  cfg: any;
}

const Select: React.FC<SelectProps> = ({ cfg }) => {
  const [data, setData] = useState<any>([]);
  const [theme, setTheme] = useState<any>({});
  const [filters, setFilters] = useState<any>(['=']);
  const [myService, setMyService] = useState<MyService | null>(null);

  useEffect(() => {
    const koob = cfg.getRaw().dataSource.koob;
    const service = MyService.createInstance(koob);
    setMyService(service);

    service.subscribeUpdatesAndNotify((model: any) => {
      const dataSource = cfg.getRaw().dataSource || {};
      const koob = dataSource.koob || "oracle.orders_full";
      const dataSourceFilters = dataSource.filters || {};

      if (model.loading || model.error) return;

      setData(model.dictionaries);
      setFilters([...filters, ...model.dictionaries.org_name.values]);
    });

    return () => {
      service.unsubscribeUpdatesAndNotify();
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const result = event.target.value;

    if (event.target.checked) {
      setFilters((prevFilters) => [...prevFilters, result]);
    } else {
      setFilters((prevFilters) => prevFilters.filter((el) => el !== result));
    }
  };

  const handleSubmit = () => {
    if (myService) {
      myService.setFilters({ org_name: filters });
    }
  };

  return (
    <div>
      {data.org_name?.values.map((el: string) => (
        <div key={el}>
          <input
            id={el}
            type="checkbox"
            defaultChecked
            value={el}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor={el}>{el}</label>
        </div>
      ))}
      <button type="button" onClick={() => handleSubmit()}>
        Подтвердить фильтры
      </button>
    </div>
  );
};

export default Select;

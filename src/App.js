import { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";

export default function App() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState("");

  const fetchData = async () => {
    let params = {
      "page[limit]": 10
    };

    if (!!page) {
      params = { ...params, "page[offset]": page };
    }
    if (!!search) {
      params = { ...params, "filter[text]": search };
    }
    if (!!page) {
      params = { ...params, "filter[categories]": filters };
    }
    console.log(params);

    const res = await axios.get(`https://kitsu.io/api/edge/anime`, {
      params: params
    });
    // .then((response) => response.json())
    // .catch((e) => console.error(e))
    // .then((json) => json.data);

    return res;
  };
  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => {
        console.log(json);
        setUsers(json.data);
        setPage(10);
      });
    console.log(filters);
  }, [filters]);

  const loadMore = async (page) => {
    fetchData({ page: page, search: search, filters: filters })
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => {
        setUsers((prev) => [...prev, ...json.data]);
        setPage(page + 10);
        setLoading(false);
      });
  };
  return (
    <>
      <div className="search-select">
        <span className="search-bar">
          <input onChange={(el) => setSearch(el.target.value)} />
          <button
            onClick={() => {
              setLoading(true);
              fetchData({ page: page, search: search, filters: filters })
                .then((response) => response.json())
                .catch((e) => console.error(e))
                .then((json) => {
                  setUsers(json.data);
                  setLoading(false);
                });
            }}
          >
            search
          </button>
        </span>
        <span className="select-bar">
          <select
            value={filters}
            onChange={(e) => {
              console.log(e.target.value);
              setFilters(e.target.value);
              fetchData({ page: page, search: search, filters: filters })
                .then((response) => response.json())
                .catch((e) => console.error(e))
                .then((json) => {
                  setUsers(json.data);
                  setLoading(false);
                });
            }}
          >
            <option label="adventure" value="adventure" />
            <option label="drama" value="drama" />
            <option label="thriller" value="thriller" />
            <option label="novel" value="novel" />
            <option label="horror" value="horror" />
          </select>
        </span>
      </div>
      <div className="App">
        {(!loading || users.length > 1) &&
          users.map((user) => {
            return (
              <div
                key={user.id}
                className="card"
                title={user.attributes.canonicalTitle}
                onClick={() =>
                  setUsers(users.filter((elem) => user.id !== elem.id))
                }
              >
                <img
                  className="card-img"
                  src={user.attributes.posterImage.tiny}
                  alt="img"
                />
                <div className="label">{user.attributes.canonicalTitle}</div>
              </div>
            );
          })}
      </div>
      <div>
        {loading ? (
          "LOADING..."
        ) : (
          <button
            style={{ marginTop: "10px" }}
            onClick={() => {
              setLoading(true);
              loadMore(page);
            }}
          >
            Загрузить ещё
          </button>
        )}
      </div>
    </>
  );
}

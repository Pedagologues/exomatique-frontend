import { useRef, useState } from "react";
import useEffectOnce from "../../api/hook/fetch_once";
import Request from "../../api/Request";

import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  List,
  Paper,
  TextField,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import { useSearchParams } from "react-router-dom";
import IExercise from "./IExercise";
import ExerciseCard from "./ExerciseCard";
interface IFilter {
  query: string;
  tags: string[];
}

export default function ExercisesPane(props: { isPrivate: boolean }) {
  const token = useSelector((state: RootState) => state.credentials.token);
  //Query all tags once
  const [availableTags, setAvailableTags] = useState(
    undefined as undefined | string[]
  );

  useEffectOnce(() => {
    Request("exercises", "tags")
      .get()
      .then((v) => {
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  let [, setUrlParams] = useSearchParams();

  let [filter, setFilter] = useState({
    query: "",
    tags: [] as string[],
  } as IFilter);

  //Remember currently shown exercises
  let [exercises, setExercises] = useState([] as IExercise[]);
  const SIZE = 10;
  let [isSearching, setIsSearching] = useState(false);
  let [page, setPage] = useState(0);
  let [count, setCount] = useState(0);

  const searchInput: React.Ref<any> = useRef(null);

  const [lastFilter, setLastFilter] = useState(
    undefined as IFilter | undefined
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maxPage = Math.ceil(count / SIZE);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastPage, setLastPage] = useState(0);

  const onSearch = () => {
    if (isSearching) return;

    let params = new URLSearchParams();
    if (filter.query !== "") params.append("q", btoa(filter.query));
    filter.tags.forEach((v) => params.append("tag", v));
    setUrlParams(params.toString());
    if (lastFilter === filter && lastPage === page) return;
    if (lastFilter !== filter) {
      setPage(0);
    }
    let safe_page = lastFilter === filter ? page : 0;
    setIsSearching(true);
    Request("exercises", "request", ":begin", ":end")
      .post({
        begin: safe_page * SIZE,
        end: (safe_page + 1) * SIZE,
        viewer: props.isPrivate ? token : undefined,
        ...filter,
      })
      .then((v) => {
        setCount(v.count);
        setExercises(v.exercises || ([] as IExercise[]));
      })
      .finally(() => {
        setLastFilter(filter);
        return setIsSearching(false);
      });
  };

  useEffectOnce(
    () => onSearch(),
    [
      setIsSearching,
      isSearching,
      filter,
      setExercises,
      lastFilter,
      page,
      lastPage,
    ]
  );
  if (availableTags === undefined || exercises === undefined)
    return <div></div>;
  return (
    <Paper
      style={{
        paddingTop: 20,
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Paper
        elevation={5}
        style={{
          margin: 20,
          padding: 20,
          display: "flex",
          width: "100%",
          height: 200,
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Container
          maxWidth={false}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 5,
            flex: 1,
          }}
        >
          <TextField
            inputRef={searchInput}
            value={filter.query}
            fullWidth
            onChange={(e) =>
              setFilter({ ...filter, query: e.currentTarget.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();

                setTimeout(() => {
                  if (searchInput.current) searchInput.current.blur();
                });
              }
            }}
          />
          <Button onClick={() => onSearch()}>SEARCH</Button>
        </Container>
        <List
          style={{
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
          }}
        >
          {(availableTags || []).map((v) => {
            return (
              <FormControlLabel
                key={v}
                control={
                  <Checkbox
                    checked={filter.tags.find((u) => u === v) !== undefined}
                    onChange={(e) => {
                      let tags2 = filter.tags.filter((u) => u !== v);
                      if (e.currentTarget.checked) {
                        tags2.push(v);
                      }
                      setFilter({ ...filter, tags: tags2 });
                    }}
                  />
                }
                label={v}
                labelPlacement="start"
              />
            );
          })}
        </List>
      </Paper>
      <Paper
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {exercises.map((v, i) => {
          return (
            <ExerciseCard
              exercise={{ ...v }}
              key={v.id}
              setExercise={(exercise) => {
                setExercises(
                  exercises.map((v) => (v.id === exercise.id ? exercise : v))
                );
              }}
            />
          );
        })}
      </Paper>
    </Paper>
  );
}

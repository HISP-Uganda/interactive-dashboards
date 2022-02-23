import { useStore } from "effector-react";
import { $store } from "../Store";
import OrgUnitTree from "./OrgUnitTree";

export default function Home() {
  const store = useStore($store);
  return <>
  <OrgUnitTree/>
    <pre>{JSON.stringify(store.organisationUnits)}</pre>
  </>;
}

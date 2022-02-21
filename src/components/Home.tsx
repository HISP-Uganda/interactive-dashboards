import { useStore } from "effector-react";
import { $store } from "../Store";

export default function Home() {
  const store = useStore($store);
  return <div>
    <pre>{JSON.stringify(store.organisationUnits)}</pre>
  </div>;
}

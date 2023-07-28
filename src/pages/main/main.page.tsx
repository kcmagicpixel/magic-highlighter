import { observer } from "mobx-react-lite";
import { Header } from "./components/header.component";
import { Tournaments } from "./components/tournaments.component";
import { Banner } from "./components/banner.component";

export const MainPage = observer(() => {
  return (
    <>
      <Header />
      <main>
        <Tournaments />
      </main>
      <Banner />
    </>
  );
});

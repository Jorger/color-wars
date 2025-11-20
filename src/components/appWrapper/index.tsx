import "./styles.css";
import { useGameScale } from "../../hooks";

const CLASS_NAMES = {
  CONTAINER: "container",
  SCREEN: "screen",
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const gameRef = useGameScale();

  return (
    <div className={CLASS_NAMES.CONTAINER}>
      <div className={CLASS_NAMES.SCREEN} ref={gameRef}>
        {children}
      </div>
    </div>
  );
};

export default AppWrapper;

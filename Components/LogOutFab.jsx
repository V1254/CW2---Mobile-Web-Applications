import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      top: theme.spacing(2),
    },
  },
}));

export default function LogOutFab() {
  const classes = useStyles();

  const onLogoutClick = async () => {
    console.log(`logging user out`);
    await fetch("/api/logout");
    Router.push("/?loggedOut=true");
  };

  return (
    <Fab
      aria-label="Log Out"
      className={classes.root}
      color="secondary"
      variant="extended"
      size="large"
      onClick={onLogoutClick}
    >
      Log Out
    </Fab>
  );
}

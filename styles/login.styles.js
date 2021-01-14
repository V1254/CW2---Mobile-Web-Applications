import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    placeContent: "center",
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  loginContainer: {
    alignSelf: "center",
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;

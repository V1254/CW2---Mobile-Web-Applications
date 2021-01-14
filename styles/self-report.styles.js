import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    placeContent: "center",
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  formContainer: {
    alignSelf: "center",
    textAlign: "center",
    // outline: "2px solid red"
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  select: {
    textAlign: "left",
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export default useStyles;

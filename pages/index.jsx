import { useState } from "react";
import utils from "../lib/utils";
import useStyles from "../styles/login.styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Router from "next/router";
import ButtonWithSpinner from "../Components/ButtonWithSpinner";
import { useRouter } from "next/router";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const LoginPage = () => {
  const router = useRouter();
  const { needsAuth, msg, loggedOut } = router.query;
  const classes = useStyles();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [usernameError, setUserNameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(!!((needsAuth && msg) || loggedOut));

  const closeBar = () => {
    setSnackBarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const [status, dataOrError] = await utils.handlePost("/api/login", { username, password });
    setLoading(false);
    if (status === 200) {
      return Router.push("/home"); // move them to the dashboard
    } else {
      const { error } = dataOrError;
      error.match(/password/i) ? setPasswordError(error) : setUserNameError(error);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm" className={classes.loginContainer}>
        <Paper elevation={3} className={classes.paper}>
          <form className={classes.loginForm} onSubmit={handleSubmit}>
            <Typography variant="h4" color="secondary" gutterBottom>
              System Login
            </Typography>
            <TextField
              name="username"
              value={username}
              color="primary"
              label={usernameError ? "Invalid username" : `Your UserName`}
              helperText={usernameError}
              error={!!usernameError}
              margin="dense"
              onChange={(e) => {
                setUserName(e.target.value);
                usernameError && setUserNameError(null);
              }}
              required
            />
            <TextField
              name="password"
              value={password}
              color="primary"
              label={passwordError ? `Invalid Password` : `Your Password`}
              helperText={passwordError}
              error={!!passwordError}
              margin="dense"
              onChange={(e) => {
                setPassword(e.target.value);
                passwordError && setPasswordError(null);
              }}
              type="password"
              required
            />

            <ButtonWithSpinner
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              isLoading={isLoading}
            >
              Login
            </ButtonWithSpinner>
          </form>
        </Paper>
        <Snackbar open={snackBarOpen} autoHideDuration={5000} onClick={closeBar} onClose={closeBar}>
          <MuiAlert elevation={6} variant="filled" severity={loggedOut ? "success" : "warning"}>
            {msg || `Successfully Logged Out`}
          </MuiAlert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default LoginPage;

LoginPage.getInitialProps = async ({ req, res }) => {
  const loggedIn = await utils.isAuthenticated(req, res);
  if (loggedIn) {
    utils.moveToLocation(res, "/home");
    return {};
  }

  return {
    isLoggedIn: false,
  };
};

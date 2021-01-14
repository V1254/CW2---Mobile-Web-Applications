import { useReducer } from "react";
import utils from "../lib/utils";
import useStyles from "../styles/self-report.styles";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CompleteCard from "../Components/CompleteCard";
import ButtonWithSpinner from "../Components/ButtonWithSpinner";
import LogOutFab from "../Components/LogOutFab";
import absoluteUrl from "next-absolute-url";

const initialState = {
  fullName: "",
  email: "",
  age: "",
  gender: "",
  address: "",
  postcode: "",
  ttnCode: "",
  testResult: "",
  ageError: false,
  codeError: false,
  isProcessing: false,
  isSubmitted: false,
  submitError: {
    type: null,
    msg: null,
  },
};

const AGE_ERROR_ACTION = (value) => ({
  name: "ageError",
  value,
});
const TTN_CODE_ERROR_ACTION = (value) => ({
  name: "codeError",
  value,
});

const SET_PROCESSING = (value) => ({
  name: "isProcessing",
  value,
});

const reducer = (state, { name, value }) => {
  if (name === "RESET") return initialState;

  if (name === "submitError") {
    return {
      ...state,
      submitError: {
        ...value,
      },
    };
  }

  return {
    ...state,
    [name]: value,
  };
};

const SelfReportPage = ({ isAuthed }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    email,
    fullName,
    age,
    gender,
    address,
    postcode,
    ttnCode,
    testResult,
    ageError,
    codeError,
    isProcessing,
    isSubmitted,
    submitError,
  } = state;

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    if (name === "age") {
      // validate as they type for age
      const isValid = utils.isValidAge(value);
      // error update
      dispatch(AGE_ERROR_ACTION(!isValid));
    } else if (name === "ttnCode" && codeError) {
      // remove the error when they start typing a new code... (only validate on submittion)
      dispatch(TTN_CODE_ERROR_ACTION(false));
    }

    dispatch({
      name,
      value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SET_PROCESSING(true));

    // our markup already provides some validation (in terms of required fields) ~ we need to validate the code and also check their age is a number
    if (!utils.isValidAge(age)) {
      dispatch(AGE_ERROR_ACTION(true));
      dispatch(SET_PROCESSING(false));
    }

    // verify the ttn code can be used
    const isValidCode = await utils.isValidTTNCode(ttnCode);

    if (!isValidCode) {
      // error
      console.log(`failed ttn validation???`);
      dispatch(TTN_CODE_ERROR_ACTION(true));
      dispatch(SET_PROCESSING(false));
      return;
    }

    // we are all good here
    const result = await utils.persistTestResult({
      email,
      fullName,
      age,
      gender,
      address,
      postcode,
      ttnCode,
      testResult,
    });

    console.log(`submit =>`, result);

    if (result.data) {
      // this will show our finish component once finished.
      dispatch({
        name: "isSubmitted",
        value: true,
      });
      return;
    } else {
      // we should inform the user of the error here..
      const { error } = result;
      if (error && error.match(/email/i)) {
        dispatch({
          name: "submitError",
          value: {
            type: "Email",
            msg: "The provided email has already been used",
          },
        });
        dispatch(SET_PROCESSING(false));
      }
    }

    console.error(`handle submit failed with err: `, result.error);
  };

  if (isSubmitted) {
    return <CompleteCard onReportAnother={() => dispatch({ name: "RESET" })} />;
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="sm" className={classes.formContainer}>
        <Paper elevation={3} className={classes.paper}>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Typography variant="h4" color="secondary" gutterBottom>
              TTN REPORT
            </Typography>
            <TextField
              name="fullName"
              value={fullName}
              color="primary"
              label="Your FullName"
              margin="dense"
              onChange={handleFieldChange}
              required
            />
            <TextField
              name="email"
              value={email}
              type="email"
              color="primary"
              label="Your Email"
              margin="dense"
              onChange={handleFieldChange}
              helperText={submitError.type && submitError.msg}
              error={!!submitError.type}
              required
            />
            <TextField
              name="age"
              value={age}
              color="primary"
              label={ageError ? `Invalid Age` : "Your Age"}
              margin="dense"
              onChange={handleFieldChange}
              helperText={ageError && `The age ${age} is invalid, please enter a valid age.`}
              error={ageError}
              required
            />
            <TextField
              name="address"
              value={address}
              color="primary"
              label="Your Address"
              margin="dense"
              onChange={handleFieldChange}
              required
            />
            <TextField
              name="postcode"
              value={postcode}
              color="primary"
              label="Your Postcode"
              margin="dense"
              onChange={handleFieldChange}
              required
            />
            <TextField
              className={classes.select}
              label="Your Gender"
              name="gender"
              value={gender}
              onChange={handleFieldChange}
              color="primary"
              margin="dense"
              select
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              name="ttnCode"
              value={ttnCode}
              color="primary"
              label={codeError ? `Invalid TTN` : "Your TTN Code"}
              margin="dense"
              onChange={handleFieldChange}
              helperText={codeError && `The Code ${ttnCode} is invalid or has been used`}
              error={codeError}
              required
            />
            <TextField
              className={classes.select}
              label="Your Test Result"
              name="testResult"
              value={testResult}
              onChange={handleFieldChange}
              color="primary"
              margin="dense"
              select
              required
            >
              <MenuItem value="Positive">Positive</MenuItem>
              <MenuItem value="Negative">Negative</MenuItem>
              <MenuItem value="Inconclusive">Inconclusive</MenuItem>
            </TextField>
            <ButtonWithSpinner
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              className={classes.button}
              isLoading={isProcessing}
            >
              Submit
            </ButtonWithSpinner>
          </form>
        </Paper>
      </Container>
      {isAuthed && <LogOutFab />}
    </div>
  );
};

export default SelfReportPage;

// verify user is logged in before displaying the page
SelfReportPage.getInitialProps = async ({ req, res }) => {
  const cookie = req?.headers.cookie;
  const { origin } = absoluteUrl(req);
  const [statusFromRoleCheck] = await utils.handlePost(
    `${origin}/api/verifyUserRole`,
    {
      roleIs: "admin",
    },
    cookie
  );

  if (statusFromRoleCheck === 401) {
    // no cookies or the user never logged in
    utils.moveToLocation(
      res,
      "/?needsAuth=true&msg=You need to authenticate before accessing any of the services"
    );
    return { isAuthed: false };
  }

  return { isAuthed: true };
};

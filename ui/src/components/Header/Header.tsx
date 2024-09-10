/* Libraries */
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

/* Application files */
import { AuthContext } from '../../context';

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        display: 'flex',
        backgroundColor: 'green',
        color: 'white',
        padding: 10,
        // flexDirection: 'row',
        // alignItems: 'center'
    },
    navContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginRight: 10
        
    },
    button: {
        color: 'black !important',
        backgroundColor: 'yellow !important',
        marginRight: '10px !important',
        '&:hover': {
            backgroundColor: 'orange !important',
        }
    }
    // image: {
    //     width: '90vw',
    //     maxWidth: 700
    // },
    // title: {
    //     width: '100%',
    //     textAlign: 'center',
    //     fontFamily: 'Norse',
    //     fontSize: 26
    // },
    // properties: {
    //     maxWidth: '100%',
    //     width: 800,
    //     textAlign: 'center'
    // },
    // description: {
    //     fontWeight: 'normal',
    //     fontSize: 20,
    //     textAlign: 'center',
    //     marginTop: 0
    // }
}));


export function Header() {

    const auth = useContext(AuthContext);
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <h1>Buffout</h1>
            <div className={classes.navContainer}>
                <Link to="/">
                    <Button className={classes.button} variant="contained">
                        Calculator
                    </Button>
                </Link>
                {!auth.isLoggedIn &&
                    <Link to="/login">
                        <Button className={classes.button} variant="contained">
                            Login
                        </Button>
                    </Link>
                }   
                {auth.isLoggedIn &&
                    <Link to={`/account/${auth.userId}`}>
                        <Button className={classes.button} variant="contained">
                            My Account
                        </Button>
                    </Link>
                }
                {auth.isLoggedIn &&
                    <Link to="/users">
                        <Button className={classes.button} variant="contained">
                            All users
                        </Button>
                    </Link>
                }
                {auth.isLoggedIn &&
                    <Button className={classes.button} variant="contained" onClick={auth.onLogout}>
                        Log Out
                    </Button>
                }      
            </div>     
        </div>
    );
}

export default Header;
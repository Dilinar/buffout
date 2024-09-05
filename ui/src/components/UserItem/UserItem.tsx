import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardMedia  from "@mui/material/CardMedia";
import Avatar from '@mui/material/Avatar';

export function UserItem(props: any) {
    console.log(`http://localhost:3000/${props.image}`);
    return (
        <li>
            <Link to={`/account/${props.id}`}>
                <Card style={{ backgroundColor: 'grey', margin: '10px' }}>
                    <CardContent>
                        <Avatar alt={props.name} src={`http://localhost:3000/${props.image}`} />
                        <h2>{props.name}</h2>
                    </CardContent>
                </Card>
            </Link>
        </li>
    );
}

export default UserItem;

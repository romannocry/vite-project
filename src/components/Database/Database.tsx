
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
//import { Button, ButtonGroup, ButtonToolbar, Card } from 'reactstrap';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { FiList } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdShare } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa';

function Database(db: any) {

   const [database, setDatabase] = useState(db.database);
   const [isLoading, setIsLoading] = useState(false);
   const componentIsMounted = useRef(true);
    
    useEffect(() => {
        console.log(database)
    }, []);

    return (
        <>
        <Card sx={{ 
        height: 250, 
        display: "flex", 
        flexDirection: "column" 
        }}>
        <CardHeader
            avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
            </Avatar>
            }
            action={
            <IconButton aria-label="settings">
                <BsThreeDotsVertical/>
            </IconButton>
            }
            title={database.creator}
            subheader={database.creator}
        />

            <CardContent sx={{ 
                flexGrow: 1,  // Takes up remaining space
                overflowY: "auto" // Scrolls if content overflows
            }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {database.name}
            </Typography>
        </CardContent>
        <CardActions sx={{ 
        justifyContent: "space-between", 
        borderTop: "1px solid #ddd", // Optional: Adds a separator
        padding: "8px"
      }}>


            <Link to={`/database/${database.name}/create-dataset`}>
                <IconButton aria-label="add to favorites">
                    <FaHeart/>
                </IconButton>
            </Link>
            <Link to={`/database/${database.name}`}>
                <IconButton aria-label="share">
                    <MdShare/>
                </IconButton>
            </Link>

        </CardActions>
        </Card>
        </>
        );
    }
            
    export default Database;
            
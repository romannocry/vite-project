import { useParams } from "react-router-dom";
import { Box, Button, ButtonGroup, Card, CardContent, Typography } from '@mui/material';
import { Container } from 'reactstrap';
import { FaDatabase, FaDownload, FaEdit } from "react-icons/fa";

function DatasetList() {
    const { databaseid } = useParams();

    return (
        <Container>
            <h1>Dataset List</h1>
            <Card sx={{ display: "flex", border: "1px solid #e5e4e5", width: "100%", justifyContent: "space-between", margin:'5px'}} elevation={0}>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        Dataset Name
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}> 
                        <FaDatabase /> Database
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        452 rows
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", padding: '10px' }}>
                    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                            <Button>Edit&nbsp;<FaEdit /></Button>
                            <Button>Download&nbsp;<FaDownload /></Button>
                            <Button loading loadingPosition="start">
                                Save
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </Box>
            </Card>
            <Card sx={{ display: "flex", border: "1px solid #e5e4e5", width: "100%", justifyContent: "space-between", margin:'5px'}} elevation={0}>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        Dataset Name
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        <FaDatabase /> Database
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        452 rows
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", padding: '10px' }}>
                    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                            <Button>Edit&nbsp;<FaEdit /></Button>
                            <Button>Download&nbsp;<FaDownload /></Button>
                            <Button loading loadingPosition="start">
                                Save
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </Box>
            </Card>
            <Card sx={{ display: "flex", border: "1px solid #e5e4e5", width: "100%", justifyContent: "space-between", margin:'5px'}} elevation={0}>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        Dataset Name
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        <FaDatabase /> Database
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", padding: '10px' }}>  {/* Centered Vertically */}
                    <Typography component="div" sx={{ m: 0 }}>
                        452 rows
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", padding: '10px' }}>
                    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
                        <ButtonGroup variant="outlined" aria-label="Loading button group">
                            <Button>Edit&nbsp;<FaEdit /></Button>
                            <Button>Download&nbsp;<FaDownload /></Button>
                            <Button loading loadingPosition="start">
                                Save
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </Box>
            </Card>
        </Container>
    )
}

export default DatasetList
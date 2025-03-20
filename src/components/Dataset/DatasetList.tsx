import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Container } from 'reactstrap';

function DatasetList() {
  const { databaseid } = useParams();

  return (
    <Container>
    <h1>Dataset List</h1>
    <Card sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
  <Box sx={{ display: "flex", flexDirection: "column",padding:'10px'}}>
    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
      <Typography component="div" sx={{ m: 0 }}>
        Dataset 1
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ color: "text.secondary", m: 0 }}>
        Mac Miller
      </Typography>
    </CardContent>
  </Box>
  <Box sx={{ display: "flex", flexDirection: "column",padding:'10px'}}>
    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
      <Typography component="div" sx={{ m: 0 }}>
        Dataset 2
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ color: "text.secondary", m: 0 }}>
        Mac Miller
      </Typography>
    </CardContent>
  </Box>
  <Box sx={{ display: "flex", flexDirection: "column",padding:'10px'}}>
    <CardContent sx={{ flex: "1 0 auto", padding: "0 !important" }}>
      <Typography component="div" sx={{ m: 0 }}>
        Dataset 2
      </Typography>
      <Typography variant="subtitle1" component="div" sx={{ color: "text.secondary", m: 0 }}>
        Mac Miller
      </Typography>
    </CardContent>
  </Box>
</Card>
        </Container>
  )
}

export default DatasetList
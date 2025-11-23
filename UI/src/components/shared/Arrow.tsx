import { Box } from "@mui/material";


export const Arrow = () => {

    return (
        <>
            <Box sx={{
                marginLeft: '5px', width: '1em',
                height: 'auto'
            }} component={'img'} src={'/assets/arrow.svg'}>

            </Box>
        </>
    )
}
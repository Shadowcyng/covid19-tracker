import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

import './InfoBox.css'

const InfoBox = ({onClick, title, cases, total, active, isRed }) => {
    return (
        <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={onClick}>
            <CardContent>
                <Typography className='infoBox__title' color='textSecondary'>
                {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}> {cases} </h2>
                <Typography className='infoBax__total' color='textSecondary'>
                {total} Total
                </Typography> 

            </CardContent>
        </Card>
    )
}

export default InfoBox

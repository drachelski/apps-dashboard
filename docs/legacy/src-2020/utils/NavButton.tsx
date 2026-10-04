import React from "react";
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

interface IProps {
    title: string;
    linkTo: string;
    className?: string;
    onClick?: () => void;
}

export const createNavButton = (props: IProps) => withRouter(({ history }) => (
    <Button 
        variant="contained"
        color="secondary" 
        className={props.className}
        onClick={
            () => { history.push(props.linkTo) }
        }
    >
        {props.title ? props.title : "Back"}
    </Button>
));

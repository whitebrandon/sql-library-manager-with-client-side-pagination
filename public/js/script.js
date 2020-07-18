/******************************************
SQL Library Manager
Name: Brandon White
Date of Last Modification: 17/07/2020
******************************************/

'strict';

    document.addEventListener('DOMContentLoaded', () => {
        const inputs = [...document.getElementsByTagName('input')];

        inputs[0].name !== "search" ? inputs[0].focus() : null;
    })


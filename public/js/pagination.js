/******************************************
SQL Library Manager
Name: Brandon White
Date of Last Modification: 17/07/2020
******************************************/

document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const rows = [...document.querySelectorAll('tbody tr')];
    const amtToDisplay = 10;
    const pathname = window.location.pathname;
    let searchList = [];

    function showPage (list, page) {
        const start = (page * amtToDisplay - amtToDisplay) ;
        const end = (page * amtToDisplay);
        for (let i = 0; i < list.length; i++) {
            i >= start && i < end ? list[i].style.display = "" : list[i].style.display = "none";
        }
    }

    function addPageLinks (pageCount, pageNumber) {
        let i = 0;
        if (document.querySelector('.pagination')) {
            while (i < pageCount) {
                const page = document.createElement('A');
                page.setAttribute('href', `/books/pg/${++i}`);
                i === pageNumber ? page.className ='active' : null;
                page.textContent = i;
                document.querySelector('.pagination').appendChild(page);
            }
        }
    }

    function addClickEventToLinks (list) {
        [...document.querySelectorAll('.pagination a')].map(anchor => anchor.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState({page: e.target.textContent}, "", `/books/pg/${e.target.textContent}`);
            appendPageLinks(list, parseInt(e.target.textContent));
        }));
    }

    function search (e) {
        searchList = [];
        const value = e.target.value;
        for (let i = 0; i < rows.length; i++) {
            rows[i].innerText.toLowerCase().includes(value) ? searchList.push(rows[i]) : null;
        }
        console.log(searchList);
        appendPageLinks(searchList, 1);
    }

    function appendPageLinks (list, pageNumber) {
        document.querySelector('.pagination') ? wrapper.removeChild(document.querySelector('.pagination')) : null;
        const pageCount = Math.ceil(list.length/amtToDisplay)
        if (pageCount > 1) {
            const pagination = document.createElement('DIV');
            pagination.className = 'pagination';
            wrapper.appendChild(pagination);
        }
        
        addPageLinks(pageCount, pageNumber);
        addClickEventToLinks(list);
        for (let i = 0; i < rows.length; i++) {
            rows[i].style.display = "none";
        }
        showPage(list, pageNumber);
    }
    appendPageLinks(rows, parseInt(pathname.substring(pathname.lastIndexOf('/') + 1)));
    document.querySelector('input[name="search"]').addEventListener('input', search, false);
})

    function httpGet(theUrl) {
        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open("GET", theUrl, false);
        xmlHttpReq.send(null);
        return xmlHttpReq.responseText;
    }

    function getProgram() {
        var data = httpGet('https://anilkkt.github.io/data/program.json');
        return JSON.parse(data);
    }

    function hideAll() {
        const slides = document.getElementsByClassName('slide');
        for(let i = 0; i<slides.length; i++) {
            slides[i].style.display = 'none';
        }
    }

    function showSlide(num) {
        hideAll();
        const slides = document.getElementsByClassName('slide');
        slides[num].style.display = "block";
    }

    function getSectionNumber(pgNumber) {
        let count = 0;
        const sections = document.getElementsByClassName('section');
        for(let i = 0; i<sections.length; i++) {
            const slides = sections[i].getElementsByClassName('slide');
            count += slides.length;
            if (count > pgNumber) {
                return i+1;
            }
        }
        return sections.length;
    }

    document.onkeydown = function (e) {
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                pageNumber++;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                pageNumber--;
                break;
        }
        if(pageNumber < 0) {
            pageNumber = 0;
        }
        else if (pageNumber >= pageLength) {
            pageNumber = pageLength-1;
        }
        showSlide(pageNumber);
        updateFooter();
    };

    function updateFooter() {
        const secNum = getSectionNumber(pageNumber);
        const pageNum = document.getElementById('pageNumber');
        pageNum.innerText = `Section: ${secNum} Slide: ${pageNumber + 1} `;
    }

    function getRootSlide(titleText, subTitleText) {
        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('title');
        title.innerText = titleText;

        const subTitle = document.createElement('p');
        subTitle.classList.add('sub-title');
        subTitle.innerText = subTitleText;

        slide.appendChild(title);
        slide.appendChild(subTitle);

        return slide;
    }

    function getSummarySlide(objSections, subTitle) {

        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('list-title');
        title.innerText = subTitle;

        const list = document.createElement('ul');
        list.classList.add('list');

        objSections.forEach(section => {
            const listItem = document.createElement('li');
            listItem.innerText = section.title;
            list.appendChild(listItem);
        });

        slide.appendChild(title);
        slide.appendChild(list);

        return slide;
    }


    function getSectionHeaderSlide(titleText, subTitleText) {
        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('section-title');
        title.innerText = titleText;

        const subTitle = document.createElement('p');
        subTitle.classList.add('section-sub-title');
        subTitle.innerText = subTitleText;

        slide.appendChild(title);
        slide.appendChild(subTitle);

        return slide;
    }

    function getContentHeaderSlide(titleText) {
        const slide = getSlide();

        const title = document.createElement('p');
        title.classList.add('song-title');
        title.innerText = titleText;

        slide.appendChild(title);

        return slide;
    }

    function getContentLinesSlide(lines) {
        const slide = getSlide();

        const br1 = document.createElement('br');
        const br2 = document.createElement('br');
        slide.appendChild(br1);
        slide.appendChild(br2);

        lines.forEach(lineText => {
            const line = document.createElement('p');
            line.classList.add('song-verse-large');
            line.innerText = lineText;
            slide.appendChild(line);
        });

        return slide;
    }

    function getSection(slides, name) {
        const section = document.createElement('div');
        section.classList.add('section');

        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.classList.add('section-name');
        if (name) {
            input.innerText = name;
        }
        else {
            input.innerText = '';
        }
        section.appendChild(input);

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i];
            section.appendChild(slide);
        }

        return section;
    }


    function getSlidesForSection(section) {

        const slides = [];

        const headerSlide = getSectionHeaderSlide(section.title, section.subtitle);
        slides.push(headerSlide);

        for (let index = 0; index < section.content.length; index++) {
            const content = section.content[index];
            const contentHeaderSlide = getContentHeaderSlide(content.heading);
            slides.push(contentHeaderSlide);
            for (let j = 0; j < content.slides.length; j++) {
                const slide = content.slides[j];
                const linesSlice = getContentLinesSlide(slide.lines);
                slides.push(linesSlice);
            }
        }

        return slides;
    }

    function getSlide() {
        const section = document.createElement('div');
        section.classList.add('slide');
        return section;
    }

    function addProgram(obj) {

        if(!obj) {
            obj = getProgram();
        }

        const dateLabel = document.getElementById('date');
        dateLabel.innerText = `Date: ${obj.date}`;

        const body = document.getElementById('presentation');
        const rootSlide = getRootSlide(obj.title, obj.date);
        const rootSection = getSection([rootSlide], '');

        body.appendChild(rootSection);

        const summarySlide = getSummarySlide(obj.sections, obj.subtitle);
        const summarySection = getSection([summarySlide], 'Summary');
        body.appendChild(summarySection);


        for (let index = 0; index < obj.sections.length; index++) {
            const objSection = obj.sections[index];
            const sectionSlides = getSlidesForSection(objSection);
            const viewSection = getSection(sectionSlides, objSection.name);
            body.appendChild(viewSection);
        }

        console.log(obj.sections.length);

    }

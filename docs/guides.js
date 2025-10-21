
function openPDFGuide(name) {
    let link = `https://github.com/Alex461538/eniths-tables/blob/main/pdf/${name}.pdf`;
    console.log("Opening:", link);
    window.open(link, '_blank');
}
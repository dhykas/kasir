export  function stringToRp(val: string){
    const numericValue = val.replace(/[^\d]/g, '');
  
    return `Rp. ${numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

}
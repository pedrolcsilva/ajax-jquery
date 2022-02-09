$(document).ready(function(){
  
  let dateIn="a";
  let dateOut="a";

  $.ajax({ url: "https://economia.awesomeapi.com.br/json/all"})
  .done( (data) => {
    Object.entries(data).forEach( (moeda, index) => {
      $("#moedas").append(`<option id="${index}">${moeda[0]}</option>`);
      $(".actual").hide();
    })
  })

  $("#moedas").on("change", function(){
    const moeda = $("#moedas").val();
    if(moeda != "None"){
      $.ajax( { url: `https://economia.awesomeapi.com.br/json/${moeda}`})
      .done( (data) => {
        const moedas = data[0]
        $.ajax( { url: `https://economia.awesomeapi.com.br/json/last/${moeda}`})
        .done( (data) => {
          if(moeda == "USDT"){
            moedas.close_price = data["USDBRLT"].ask;
          }else{
            moedas.close_price = data[moeda + "BRL"].ask;
          }
          $(".actual tbody").html(`<tr><td>${moedas.ask}</td> <td>${moedas.create_date}</td> <td>${moedas.low}</td> <td>${moedas.high}</td> <td>${moedas.bid}</td></tr>`)
          $(".actual").show();
        })
      })
      
    }else{
      $(".actual").hide();
    }
  })

  function convertDate(data) {
    var ConvDate= new Date(data);
    let dateTime = ConvDate.getTime() + (60000 * 1440);
    let day = new Date(dateTime).getDate();
    if(day < 10){
      day = "0"+day;
    }
    let month = new Date(dateTime).getMonth();
    month++;
    if(month < 10){
      month = "0"+month;
    }
    
    let year = new Date(dateTime).getFullYear()

    return year + "-" + month + "-" + day;
  }

  $("#date-in").on("change", function(){
    dateIn = $(this).val();
    dateIn = convertDate(dateIn);
  })
  
  $("#date-out").on("change", function(){
    dateOut = $(this).val();
    dateOut = convertDate(dateOut); 
  })

  

  $("#show").click(function(){
    $(".period tbody").html("");
    const moeda = $("#moedas").val();
    let moedas = [];
    if(dateIn != "a" && dateOut != "a" && moeda != "None"){
      let timeOut = new Date(dateOut).getTime();
      let timeIn = new Date(dateIn).getTime();
      let dateIn1;
      
      async function doAjax (args)  {
        const result = $.ajax( { url: `https://economia.awesomeapi.com.br/${moeda}?start_date=${dateIn1}&end_date=${dateIn1}`, type: 'GET', data: args })
        .done( function(data)  {
        moedas = data[0];
        
        if(new Date(dateIn).getTime() < new Date(moedas.create_date).getTime()){
          $(".period tbody").append(`<tr><td>${moedas.ask}</td> <td>${moedas.create_date}</td> <td>${moedas.low}</td> <td>${moedas.high}</td> <td>${moedas.bid}</td> </tr>`)
        }
        })
        return result
      };
      async function callAjax(){
        await doAjax();
      }
      while(timeIn <= timeOut){
        dateIn1 = convertDate(timeIn).replaceAll("-", "");
        
        callAjax();
        
        timeIn = timeIn + (60000 * 1440);
        
      }
      
      $(".period").show();
    }else{
      alert("Alguns dados não foram inseridos corretamente!!");
    }
  })


});

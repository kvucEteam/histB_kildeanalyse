var JsonObj,
    runde = 0,
    delrunde = 0,
    korrekt = false,
    score = 0,
    fejl = 0;
var hejsa = "";



$(document).ready(function() {
 //alert("Så er der kilder!");
    addKildehenvisning();

    $(".checkAnswer").click(check_answer);

    opdater_score();


    $(".dropdown").change(function() {
        var valgt_indeks = $(".dropdown option:selected").index();

        if (valgt_indeks === JsonObj[runde].opts[delrunde].korrekt_svar) {
            korrekt_svar = true;
        } else {
            korrekt_svar = false;

        }

    });
});

function addKildehenvisning(){
    $(".kilde_container").prepend("<div class='kilde_henvisning'>Så er der kilder!</div>");
}

function next_round() {

    $(".faerdig_tekst").fadeOut(0);

    $(".analysetext").html("");
    delrunde = 0;
    $(".kilde_container").fadeOut(0).html("").fadeIn(1500);


    // Load kilden ind fra Json objekt: 
    var kilde_type = JsonObj[runde].kilde_type;

    if (kilde_type == "text") {
        $.get(JsonObj[runde].kilde, function(data) {
            var txt_fil = data;
            $(".kilde_container").append(txt_fil)
        });

    } else if (kilde_type == "video") {
        $(".kilde_container").append("<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/" + JsonObj[runde].kilde + "'frameborder='0' allowfullscreen='1'></iframe>");
    } else if (kilde_type == "pic") {
        $(".kilde_container").append("<img class='pic' src='" + JsonObj[runde].kilde + "'>");
    }
    next_del_round();
}

function next_del_round() {

    korrekt_svar = false;
    $(".QuestionTask").html("");
    $(".dropdown").html("");

    $(".QuestionTask").html(JsonObj[runde].opts[delrunde].spm);
    $(".QuestionTask").fadeOut(0).fadeIn(2000);
    $(".dropdown").append("<option value='Vælg dit svar' selected>Vælg dit svar</option>");

    for (var i = 0; i < JsonObj[runde].opts[delrunde].svarmuligheder.length; i++) {
        $(".dropdown").append("<option value='" + JsonObj[runde].opts[delrunde].svarmuligheder[i] + "'>" + JsonObj[runde].opts[delrunde].svarmuligheder[i] + "</option>");
    }

}

function check_answer() {
    var dropdown_value = $(".dropdown").val();

    if (korrekt_svar === true) {

        console.log("næste delrunde_spm");

        $(".analysetext").append("<span class='txt_tween'>" + JsonObj[runde].opts[delrunde].feedback + "</span>");
        $(".txt_tween").eq(delrunde).fadeOut(0);
        $(".txt_tween").eq(delrunde).fadeIn('slow', function() {

            delrunde++;

            if (delrunde < JsonObj[runde].opts.length) {
                next_del_round();
            } else {
                $(".dropdown").fadeOut(0);
                $(".checkAnswer").fadeOut(0);
                $(".QuestionTask").fadeOut(0).html("Du har stillet kilden en mængde spørgsmål og kan læse den samlede kildeanalyse her:").fadeIn(2000);
                runde++;
                if (runde < JsonObj.length) {
                    $(".spm_container").append("<div class='btn btn-primary continue'>Næste kilde</div>");
                    $(".continue").click(next_round);
                } else {
                    $(".spm_container").append("Opgaven er slut. <br/><div class='btn btn-primary again'>Prøv igen</div>");
                    $(".again").click(function() {
                        location.reload();
                    });
                }
            }
            score++;
        });
        console.log("move on");
        //update_text();
    } else {
        fejl++;
        if ($(".dropdown option:selected").index() != 0) {
            UserMsgBox("html", dropdown_value + " er ikke det korrekte svar.");
        } else {
            UserMsgBox("html", "Vælg et svar fra dropdown menuen til venstre");
        }
    }
    opdater_score();
}

function opdater_score(){
    $(".score").html("Rigtige svar: " + score + "/" + JsonObj[runde].opts.length +" Fejl: " + fejl);
}

function loadData(url) {
    $.ajax({
        url: url,
        // contentType: "application/json; charset=utf-8",  // Blot en test af tegnsaettet....
        //dataType: 'json', // <------ VIGTIGT: Saadan boer en angivelse til en JSON-fil vaere! 
        dataType: 'text', // <------ VIGTIGT: Pga. ???, saa bliver vi noedt til at angive JSON som text. 
        async: false, // <------ VIGTIGT: Sikring af at JSON hentes i den rigtige raekkefoelge (ikke asynkront). 
        success: function(data, textStatus, jqXHR) {
            JsonObj = jQuery.parseJSON(data);
            console.log(JsonObj);
            // Alt data JsonObj foeres over i arrays:
            for (var Key in JsonObj) {
                //console.log( JsonObj[Key].English);
                //console.log(JsonObj[0].opts[0].spm)
                /*
                                 word_Array.push(JsonObj[Key].English);
                                 transArray.push(JsonObj[Key].Dansk);
                                 correct_Array.push(JsonObj[Key].Correct);
                                 feedback_Array.push(JsonObj[Key].Explanation);

                                 if (JsonObj[Key].Correct !== "2") {
                                     antal_korrekte++;
                                 }*/
            }

            //$(".correct").html("Correct answers: <b>" + score + " / " + antal_korrekte + " </b> Attempts: <b>" + attempts + "</b>");
            next_round();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error!!!\njqXHR:" + jqXHR + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
        }
    });
}

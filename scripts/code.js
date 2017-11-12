$(document).ready(function () {
  // ZMIENNE STARTOWE
  let passwordArray = [[], [], [], [], [], [], [], [], [], []];
  let playerArray = [[], [], [], [], [], [], [], [], [], []];
  let turnNumber = 1;
  let playerTurn = false;

  // LOGIKA GRY
  function randomNum(num) {
    return Math.floor((Math.random() * 4) + 1);
  }

  function newPassword(password) {
    let i = 0;

    // losowanie kombinacji na daną rundę
    for (let j = 0; j < turnNumber; j += 1) {
      password[turnNumber - 1].push(randomNum(4));
    }

    // przesuwanie mechanizmu co sekundę
    function selectLoop() {
      setTimeout(() => {
        $(`#sym${password[turnNumber - 1][i]}`).trigger('click');
        i += 1;
        if (i < turnNumber) {
          selectLoop();
        }
      }, 1000);
    }
    selectLoop();

    // aktywowanie tury gracza
    setTimeout(() => {
      playerTurn = true;
    }, (1000 * turnNumber) + 1000);
  }

  // MECHANIZM PRZESUWANIA

  // licznik przesunięć do góry
  const clickUp = {
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0
  };

  // licznik przesunięć do dołu
  const clickDown = {
    count1: 0,
    count2: 0,
    count3: 0,
    count4: 0
  };

  // ustawienie
  const soundOne = document.createElement('audio');
  soundOne.setAttribute('src', 'sounds/clipOne.mp3');
  const soundTwo = document.createElement('audio');
  soundTwo.setAttribute('src', 'sounds/clipTwo.mp3');
  const soundThree = document.createElement('audio');
  soundThree.setAttribute('src', 'sounds/clipThree.mp3');
  const soundFour = document.createElement('audio');
  soundFour.setAttribute('src', 'sounds/clipFour.mp3');

  // funkcja obsługująca przesunięcia
  function slide(e) {
    let id = e.target.id.charAt(3); // pobranie id klikniętej cyfry

    switch (id) {
      case '1':
        soundOne.play();
        break;
      case '2':
        soundTwo.play();
        break;
      case '3':
        soundThree.play();
        break;
      case '4':
        soundFour.play();
        break;
      default:
        // do nothing
    }

    if (playerTurn) {
      playerArray[turnNumber - 1].push(id); // dodanie cyfry-id do tablicy gracza
    }

    // animacja ruchu w górę
    if (clickUp[`count${id}`] >= 9) {
      $(this).animate({ top: '+=72' }, 500);
      clickUp[`count${id}`] += 1;
    }

    // animacja ruchu w dół
    if (clickDown[`count${id}`] < 9) {
      $(this).animate({ top: '-=72' }, 500);
      clickDown[`count${id}`] += 1;
      clickUp[`count${id}`] += 1;
    }

    // zresetowanie liczników przesunięć
    if (clickUp[`count${id}`] === 18) {
      clickUp[`count${id}`] = 0;
      clickDown[`count${id}`] = 0;
    }
  }

  // dodanie zdarzeń obsługi kliknięć cyfr mechanizmu
  $('#sym1').on('click', slide);
  $('#sym2').on('click', slide);
  $('#sym3').on('click', slide);
  $('#sym4').on('click', slide);

  // WYGRANA - PRZEGRANA

  // start gry
  $('#start').on('click', () => {
    $('#modal-start').fadeOut(600);

    setTimeout(() => {
      newPassword(passwordArray);
    }, 1000);
  });

  // sprawdzenie rundy
  $('#check').on('click', () => {
    if (passwordArray[turnNumber - 1].toString() === playerArray[turnNumber - 1].toString()) {
      if (turnNumber === 10) {
        $('#modal-win').css('display', 'flex');
      } else {
        playerTurn = false;
        turnNumber += 1;
        $('#number').fadeOut(500).fadeIn(500).text(turnNumber);

        setTimeout(() => {
          newPassword(passwordArray);
        }, 1000);
      }
    } else {
      $('#modal-lose').css('display', 'flex');
      $('#lose-txt').text(`Niestety, pomyliłeś kolejność. Odpadłeś w ${turnNumber} rundzie.`);
    }
  });

  // restart gry - funkcja
  function restart() {
    passwordArray = [[], [], [], [], [], [], [], [], [], []];
    playerArray = [[], [], [], [], [], [], [], [], [], []];
    turnNumber = 1;
    playerTurn = false;

    $('#sym1').animate({ top: '0' }, 500);
    $('#sym2').animate({ top: '0' }, 500);
    $('#sym3').animate({ top: '0' }, 500);
    $('#sym4').animate({ top: '0' }, 500);
    $('#number').fadeOut(500).fadeIn(500).text(turnNumber);

    clickUp.count1 = 0;
    clickUp.count2 = 0;
    clickUp.count3 = 0;
    clickUp.count4 = 0;

    clickDown.count1 = 0;
    clickDown.count2 = 0;
    clickDown.count3 = 0;
    clickDown.count4 = 0;

    setTimeout(() => {
      newPassword(passwordArray);
    }, 1000);
  }

  // restart gry - zdarzenia
  $('#lose').on('click', () => {
    $('#modal-lose').fadeOut(600);
    restart();
  });

  $('#win').on('click', () => {
    $('#modal-win').fadeOut(600);
    restart();
  });
});

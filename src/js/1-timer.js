// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const inputStart = document.querySelector('#datetime-picker')
const startButton = document.querySelector('[data-start="startBtn"]');
const daysElem = document.querySelector('[data-days="value"]');
const hoursElem = document.querySelector('[data-hours="value"]');
const minutesElem = document.querySelector('[data-minutes="value"]');
const secondsElem = document.querySelector('[data-seconds="value"]');

let userSelectedDate; 

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        const currentDate = new Date();
        if (userSelectedDate <= currentDate) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
  };

    flatpickr(inputStart,options);

    let timerInterval;
    startButton.addEventListener('click', ()=>{
        const selectedDate = new Date(inputStart.value);
        if (!selectedDate || isNaN(selectedDate.getTime())) return;

        inputStart.disabled = true;
        startButton.disabled = true;

        timerInterval = setInterval(() => {
            updateTimer(selectedDate.getTime());
          }, 1000);
        
          updateTimer(selectedDate.getTime());
    });

  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }
  

function updateTimer(endTime) {
    const total = endTime - Date.now();
    if (total <= 0) {
        clearInterval(timerInterval);
        iziToast.success({
            title: 'Countdown Finished',
            message: 'The countdown has ended!',
        });
        inputStart.disabled = false;
        startButton.disabled = true;
        return;
    }
    
    const { days, hours, minutes, seconds } = convertMs(total);
    daysElem.textContent = days.toString().padStart(2, '0');
    hoursElem.textContent = hours.toString().padStart(2, '0');
    minutesElem.textContent = minutes.toString().padStart(2, '0');
    secondsElem.textContent = seconds.toString().padStart(2, '0');
}
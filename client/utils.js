var UtilityMethods = (function () {

    function shuffleArray(arr) {
        let counter = arr.length;
        for (let i = 0; i < arr.length; i++) {
            let index = Math.floor(Math.random() * counter);
            counter--;

            let temp = arr[counter];
            arr[counter] = arr[index];
            arr[index] = temp;
        }
        return arr;
    }

    return {
        shuffleArray: shuffleArray
    }
})();

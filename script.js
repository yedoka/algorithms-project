function generateRandomArray(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10000));
}

function testSortingAlgorithm(algorithm, array) {
  const startTime = performance.now();
  const sortedArray = algorithm([...array]);
  const endTime = performance.now();
  const timeConsumed = endTime - startTime;

  return { sortedArray, timeConsumed };
}

function quickSort(array) {
  if (array.length <= 1) {
    return array;
  }

  const pivot = array[0];
  const left = [];
  const right = [];

  for (let i = 1; i < array.length; i++) {
    if (array[i] < pivot) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let currentElement = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > currentElement) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = currentElement;
  }

  return array;
}

function radixSort(array) {
  const maxNum = Math.max(...array) * 10;
  let divisor = 10;
  while (divisor < maxNum) {
    let buckets = [...Array(10)].map(() => []);
    for (let num of array) {
      buckets[Math.floor((num % divisor) / (divisor / 10))].push(num);
    }
    array = [].concat.apply([], buckets);
    divisor *= 10;
  }
  return array;
}

function heapSort(array) {
  const heapify = (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };

  const buildHeap = (arr) => {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
  };

  buildHeap(array);

  for (let i = array.length - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, i, 0);
  }

  return array;
}

function createChart(algorithmTimes) {
  const existingChart = Chart.getChart("chart");

  if (existingChart) {
    existingChart.data.labels = algorithmTimes.map(({ algorithm }) => algorithm);
    existingChart.data.datasets[0].data = algorithmTimes.map(({ averageTime }) => averageTime);
    existingChart.update();
  } else {
    const labels = algorithmTimes.map(({ algorithm }) => algorithm);
    const data = algorithmTimes.map(({ averageTime }) => averageTime);

    const ctx = document.getElementById("chart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Average Time Consumed (ms)",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)"
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
          }
        }
      }
    });
  }
}


function runSorting(arrayLength) {
  const iterations = 1000;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const algorithms = [quickSort, insertionSort, radixSort, heapSort];
  const algorithmTimes = [];

  algorithms.forEach((algorithm) => {
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const array = generateRandomArray(arrayLength);
      const start = performance.now();
      testSortingAlgorithm(algorithm, array);
      const end = performance.now();
      totalTime += end - start;
    }

    const averageTime = totalTime / iterations;
    algorithmTimes.push({ algorithm: algorithm.name, averageTime });
  });

  algorithmTimes.forEach(({ algorithm, averageTime }) => {
    const resultDiv = document.createElement("div");
    resultDiv.innerHTML = `<p><strong>${algorithm}:</strong> Average Time Consumed: ${averageTime.toFixed(
      4
    )} milliseconds over ${iterations} iterations for ${arrayLength} elements</p>`;
    resultsDiv.appendChild(resultDiv);
    createChart(algorithmTimes);
  });

  createChart(algorithmTimes);

  const fastestAlgorithm = algorithmTimes.reduce((min, current) =>
    current.averageTime < min.averageTime ? current : min
  );

  const fastestAlgorithmDiv = document.createElement("div");
  fastestAlgorithmDiv.innerHTML = `<p><strong>Fastest Sorting Algorithm:</strong> ${fastestAlgorithm.algorithm} with an average time of ${fastestAlgorithm.averageTime.toFixed(
    4
  )} milliseconds</p>`;
  resultsDiv.appendChild(fastestAlgorithmDiv);
}
export class Sorter {
  constructor(data) {
    this.data = [...data];
  }

  measureTime(fn) {
    const ops = { comparisons: 0 };
    const start = performance.now();
    const sortedArray = fn(ops);
    const end = performance.now();
    return {
      sortedArray,
      time: `${(end - start).toFixed(3)}ms`,
      comparisons: ops.comparisons,
    };
  }

  compare(a, b, key, ops) {
    ops.comparisons++;

    if (key === "createdAt") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    }

    if (key === "priority") {
      const order = ["низький", "середній", "високий"];
      return order.indexOf(a.priority) - order.indexOf(b.priority);
    }

    return 0;
  }

  heapSort(key) {
    return this.measureTime((ops) => {
      const a = [...this.data];

      const heapify = (arr, n, i) => {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        if (l < n && this.compare(arr[l], arr[largest], key, ops) > 0)
          largest = l;
        if (r < n && this.compare(arr[r], arr[largest], key, ops) > 0)
          largest = r;

        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          heapify(arr, n, largest);
        }
      };

      const n = a.length;
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
      for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        heapify(a, i, 0);
      }
      return a;
    });
  }

  bubbleSort(key) {
    return this.measureTime((ops) => {
      const a = [...this.data];
      for (let i = 0; i < a.length - 1; i++) {
        for (let j = 0; j < a.length - 1 - i; j++) {
          if (this.compare(a[j], a[j + 1], key, ops) > 0) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
          }
        }
      }
      return a;
    });
  }

  quickSort(key) {
    return this.measureTime((ops) => {
      const quick = (arr) => {
        if (arr.length <= 1) return arr;
        const pivot = arr[arr.length - 1];
        const left = [];
        const right = [];
        const middle = [];

        for (const x of arr) {
          const cmp = this.compare(x, pivot, key, ops);
          if (cmp < 0) left.push(x);
          else if (cmp > 0) right.push(x);
          else middle.push(x);
        }

        return [...quick(left), ...middle, ...quick(right)];
      };
      return quick(this.data);
    });
  }

  mergeSort(key) {
    return this.measureTime((ops) => {
      const merge = (left, right) => {
        const result = [];
        let i = 0,
          j = 0;
        while (i < left.length && j < right.length) {
          if (this.compare(left[i], right[j], key, ops) <= 0)
            result.push(left[i++]);
          else result.push(right[j++]);
        }
        return [...result, ...left.slice(i), ...right.slice(j)];
      };

      const sort = (arr) => {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = sort(arr.slice(0, mid));
        const right = sort(arr.slice(mid));
        return merge(left, right);
      };

      return sort(this.data);
    });
  }

  insertionSort(key) {
    return this.measureTime((ops) => {
      const a = [...this.data];
      for (let i = 1; i < a.length; i++) {
        const keyItem = a[i];
        let j = i - 1;
        while (j >= 0 && this.compare(a[j], keyItem, key, ops) > 0) {
          a[j + 1] = a[j];
          j--;
        }
        a[j + 1] = keyItem;
      }
      return a;
    });
  }

  selectionSort(key) {
    return this.measureTime((ops) => {
      const a = [...this.data];
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
          if (this.compare(a[j], a[minIndex], key, ops) < 0) {
            minIndex = j;
          }
        }
        if (minIndex !== i) {
          [a[i], a[minIndex]] = [a[minIndex], a[i]];
        }
      }
      return a;
    });
  }
}

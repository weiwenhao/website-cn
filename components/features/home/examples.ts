// The hero code window. Every example was built with the current nax and its output copied from a real run.
export type Example = {
  id: string;
  file: string;
  cmd: string;
  output: string;
  code: string;
  // The playground builds one main.n and runs it for a few seconds, so only a self-contained program that ends can be tried there.
  browser?: boolean;
};

export const EXAMPLES: Example[] = [
  {
    id: "http",
    file: "main.n",
    cmd: "curl localhost:8888/hello",
    output: "hello nax",
    code: `import http

fn main() {
    var app = http.server()

    app.get('/hello', fn(http.request_t req, ref<http.response_t> res):void! {
        res.send('hello nax')
    })

    app.listen(8888)
}`,
  },
  {
    id: "arena",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "nax 42",
    code: `// memory comes from an arena allocator
import allocator.arena

type book_t = struct{
    string title
    int pages
}

fn main() {
    var ar = arena.init(4096)
    defer ar.deinit()

    var b = ar.new(book_t{title: 'nax', pages: 42})
    println(b.title, b.pages)
}`,
  },
  {
    id: "generics",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "perimeter = 60",
    code: `type box<T, U> = struct {
    T width
    U length
}

fn box<T, U>.perimeter(self):T {
    return (self.width + self.length as T) * 2
}

fn main() {
    var b = box<i16, i32>{width: 10, length: 20}
    println('perimeter =', b.perimeter())
}`,
  },
  {
    id: "coroutine",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "result = 2",
    code: `import co

fn delay_sum(int a, int b):int {
    co.sleep(1000)

    return a + b
}

fn main() {
  var fut = go delay_sum(1, 1) // eq: future_t<int> fut = @async(delay_sum(1, 1))
  var result = fut.await()

  println('result =', result)
}`,
  },
  {
    id: "error",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "divisor cannot be zero\n1",
    code: `errdef DIVIDE_BY_ZERO 'divisor cannot be zero'

fn rem(int dividend, int divisor):int! {
    if divisor == 0 {
        throw DIVIDE_BY_ZERO
    }
    return dividend % divisor
}

fn main() {
    var result = rem(10, 0) catch e {
        println(e.msg()) // divisor cannot be zero
        1
    }
    println(result)
}`,
  },
  {
    id: "nullable",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "",
    code: `fn main() {
    int? foo = null
    int bar = match foo {
        is int v -> v // auto assert
        is null -> -1
    }

    assert(bar == -1)

    if foo is int v {
        assert(v == -1)
    }
}`,
  },
  {
    id: "match",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "three\n2",
    code: `fn main() {
    int n = 3
    match n {
        1|2 -> println('one or two')
        3 -> println('three') // here
        _ -> println('something else')
    }

    var res = match {
        (n < 0) -> 1
        _ -> 2
    }
    println(res) // 2
}`,
  },
  {
    id: "interface",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "12 14\n270 66",
    code: `type measurable = interface{
    fn perimeter():int
    fn area():int
}

type rectangle: measurable = struct{
    int width
    int height
}

fn rectangle.area(self):int {
    return self.width * self.height
}
fn rectangle.perimeter(self):int {
    return 2 * (self.width + self.height)
}

fn print_shape(measurable s) {
    println(s.area(), s.perimeter())
}

fn main() {
    var r = rectangle{width: 3, height: 4}
    print_shape(r)

    var r1 = new rectangle(width=15, height=18)
    print_shape(r1)
}`,
  },
  {
    id: "channel",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "recv msg = hello ch",
    code: `import co

fn main() {
    var ch = chan<string>.new()

    go delay_send(ch)

    select{
        ch.on_recv() -> msg {
            println('recv msg =', msg)
        }
    }
}

fn delay_send(chan<string> ch):void! {
    co.sleep(1000)
    ch.send('hello ch')
}`,
  },
  {
    id: "json",
    file: "main.n",
    browser: true,
    cmd: "nax build main.n && ./main",
    output: "杀死一只知更鸟 Harper Lee",
    code: `import json

type book_t = struct{
    string title
    string author
}

fn main() {
    var str = \`{"title":"杀死一只知更鸟","author":"Harper Lee"}\`

    var book = json.deserialize<book_t>(str)

    println(book.title, book.author) // 杀死一只知更鸟 Harper Lee
}`,
  },
  {
    id: "heap",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "3 4",
    code: `// allocate on the heap, release by hand
import allocator as ac

type point_t = struct{
    int x
    int y
}

fn main() {
    ptr<point_t> p = ac.new(point_t{x: 3, y: 4})
    println(p.x, p.y)
    ac.free(p)
}`,
  },
  {
    id: "vec",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "4 12 100",
    code: `// a vec whose memory comes from an allocator
import allocator as ac

fn main() {
    var list = vec<int>.alloc(&ac.heap, 0, 3)
    defer list.deinit()

    list[0] = 12
    list.push(100)
    println(list.len(), list[0], list[3])
}`,
  },
  {
    id: "libc",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "12.000000",
    code: `// call a C function directly
import libc

fn main() {
    f64 r = libc.sqrt(144.0)
    println(r)
}`,
  },
  {
    id: "error",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "divisor cannot be zero\n1",
    code: `errdef DIVIDE_BY_ZERO 'divisor cannot be zero'

fn rem(int dividend, int divisor):int! {
    if divisor == 0 {
        throw DIVIDE_BY_ZERO
    }
    return dividend % divisor
}

fn main() {
    var result = rem(10, 0) catch e {
        println(e.msg()) // divisor cannot be zero
        1
    }
    println(result)
}`,
  },
  {
    id: "nullable",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "",
    code: `fn main() {
    int? foo = null
    int bar = match foo {
        is int v -> v // auto assert
        is null -> -1
    }

    assert(bar == -1)

    if foo is int v {
        assert(v == -1)
    }
}`,
  },
  {
    id: "match",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "three\n2",
    code: `fn main() {
    int n = 3
    match n {
        1|2 -> println('one or two')
        3 -> println('three') // here
        _ -> println('something else')
    }

    var res = match {
        (n < 0) -> 1
        _ -> 2
    }
    println(res) // 2
}`,
  },
  {
    id: "generics",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "perimeter = 60",
    code: `type box<T, U> = struct {
    T width
    U length
}

fn box<T, U>.perimeter(self):T {
    return (self.width + self.length as T) * 2
}

fn main() {
    var b = box<i16, i32>{width: 10, length: 20}
    println('perimeter =', b.perimeter())
}`,
  },
  {
    id: "interface",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "12 14",
    code: `type measurable = interface{
    fn perimeter():int
    fn area():int
}

type rectangle: measurable = struct{
    int width
    int height
}

fn rectangle.area(self):int {
    return self.width * self.height
}

fn rectangle.perimeter(self):int {
    return 2 * (self.width + self.height)
}

fn print_shape(measurable s) {
    println(s.area(), s.perimeter())
}

fn main() {
    var r = rectangle{width: 3, height: 4}
    print_shape(&r) // a pointer, not a value
}`,
  },
  {
    id: "interop",
    file: "main.n",
    cmd: "nax build main.n && ./main",
    output: "144",
    code: `// square() is defined in calc.x
import 'calc.x'

fn main() {
    println(calc.square(12))
}`,
  },
  {
    id: "interop",
    file: "main.x",
    cmd: "nax build main.x && ./main",
    output: "5050",
    code: `// sum() is defined in util.n, so it is started with go
import 'util.n'

fn main() {
    var fu = go util.sum(100)
    var total = fu.await() catch e {
        -1
    }
    fu.deinit()
    println(total)
}`,
  },
];

# strings

## 概述
strings 标准库提供了一系列字符串操作的基础功能，包括字符串查找、分割、替换、修剪等常用操作。

## 函数

### from()
基于 C 字符串创建一个 Nature 字符串。

```nature
fn from(void_ptr p):string!
```

### join()
将字符串数组使用指定分隔符连接成一个字符串。

```nature
fn join([string] list, string separator):string
```

示例：
```nature
var list = ["hello", "world"]
println(strings.join(list, " "))  // 输出: hello world
```

## string 方法

### find()
查找子字符串，返回第一次出现的位置，未找到返回 -1。

```nature
fn string.find(string sub):int
```

### find_after()
从指定位置开始查找子字符串。

```nature
fn string.find_after(string sub, int after):int
```

### rfind()
从右向左查找子字符串。

```nature
fn string.rfind(string sub, int before):int
```

### contains()
判断字符串是否包含指定子字符串。

```nature
fn string.contains(string sub):bool
```

### starts_with()
判断字符串是否以指定子字符串开头。

```nature
fn string.starts_with(string starts):bool
```

### ends_with()
判断字符串是否以指定子字符串结尾。

```nature
fn string.ends_with(string ends):bool
```

### split()
使用指定分隔符分割字符串。

```nature
fn string.split(string separator):[string]
```

### slice()
截取字符串的指定部分。

```nature
fn string.slice(int start, int end):string
```

### trim()
移除字符串两端指定的字符集合。

```nature
fn string.trim([string] list):string
```

### ltrim()
移除字符串左端指定的字符集合。

```nature
fn string.ltrim([string] list):string
```

### rtrim()
移除字符串右端指定的字符集合。

```nature
fn string.rtrim([string] list):string
```

### replace()
替换字符串中的指定子串。

```nature
fn string.replace(string sub_old, string sub_new):string
```

### reverse()
反转字符串。

```nature
fn string.reverse():string
```

### to_int()
将字符串转换为整数。

```nature
fn string.to_int():int!
```

### ascii()
获取字符串第一个字符的 ASCII 码。

```nature
fn string.ascii():u8
```

## 使用示例

```nature
import strings

fn main() {
    var str = "Hello, World!"
    
    // 字符串查找
    println(str.find("World"))      // 输出: 7
    println(str.contains("Hello"))   // 输出: true
    
    // 字符串分割
    var parts = str.split(", ")
    println(parts)                   // 输出: ["Hello", "World!"]
    
    // 字符串修剪
    var text = "  hello  "
    println(text.trim([" "]))       // 输出: "hello"
    
    // 字符串替换
    println(str.replace("World", "Nature"))  // 输出: Hello, Nature!
    
    // 字符串转换
    var num = "123".to_int()
    println(num)                     // 输出: 123
}
```

## 注意事项
1. `to_int()` 方法在转换失败时会抛出异常
2. `find()` 相关方法在未找到时返回 -1
3. 字符串索引从 0 开始
4. 字符串是不可变的，所有修改操作都会返回新的字符串
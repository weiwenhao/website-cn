# runtime

## 概述
runtime 标准库提供了运行时相关的底层操作，包括向量(vec)、集合(set)、映射(map)、字符串操作以及垃圾回收等功能。

## 函数

### vec_new()
创建一个新的向量。

```nature
fn vec_new(int ref_hash, int ele_ref_hash, int len, int cap):void_ptr
```

参数:
- ref_hash: 向量类型的引用哈希值
- ele_ref_hash: 元素类型的引用哈希值
- len: 初始长度
- cap: 初始容量

### vec_push()
向向量尾部添加元素。

```nature
fn vec_push(void_ptr list, void_ptr val)
```

### vec_append()
将一个向量追加到另一个向量末尾。

```nature
fn vec_append(void_ptr list1, void_ptr list2)
```

### vec_slice()
获取向量的切片。

```nature
fn vec_slice(void_ptr list, int start, int end):void_ptr
```

### vec_concat()
连接两个向量，返回新的向量。

```nature
fn vec_concat(void_ptr list1, void_ptr list2):void_ptr
```

### vec_ref()
获取向量的引用。

```nature
fn vec_ref(void_ptr list):void_ptr
```

### vec_length()
获取向量的长度。

```nature
fn vec_length(void_ptr list):int
```

### vec_capacity()
获取向量的容量。

```nature
fn vec_capacity(void_ptr list):int
```

### set_add()
向集合中添加元素。

```nature
fn set_add(void_ptr s, void_ptr key):bool
```

### set_contains()
检查集合是否包含指定元素。

```nature
fn set_contains(void_ptr s, void_ptr key):bool
```

### set_delete()
从集合中删除指定元素。

```nature
fn set_delete(void_ptr s, void_ptr key)
```

### map_delete()
从映射中删除指定键。

```nature
fn map_delete(void_ptr m, void_ptr key)
```

### map_length()
获取映射的长度。

```nature
fn map_length(void_ptr m):int
```

### map_contains()
检查映射是否包含指定键。

```nature
fn map_contains(void_ptr s, void_ptr key):bool
```

### string_length()
获取字符串的长度。

```nature
fn string_length(void_ptr s):int
```

### string_ref()
获取字符串的引用。

```nature
fn string_ref(void_ptr s):void_ptr
```

### processor_index()
获取 gmp 模型中的 processor index

```nature
fn processor_index():int
```

### gc()
强制执行垃圾回收。

```nature
fn gc()
```

### malloc_bytes()
获取已分配的内存字节数。

```nature
fn malloc_bytes():i64
```

## 使用示例

```nature
import runtime

fn main() {
    // 强制垃圾回收
    runtime.gc()
    
    // gmp 模型中的 processor index
    var idx = runtime.processor_index()
}
```

## 注意事项
1. runtime 标准库中的大多数函数都是底层操作，需要谨慎使用
2. 垃圾回收(gc)通常由系统自动执行，只有在特殊情况下才需要手动调用

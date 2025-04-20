# syscall

## 概述
syscall 标准库提供了对系统调用的底层封装,使得程序可以直接与操作系统进行交互。包括文件操作、进程控制、网络通信等基础功能。

## 常量

### 文件操作标志
```nature
int O_RDONLY = 0x0000  // 只读模式
int O_WRONLY = 0x0001  // 只写模式
int O_RDWR   = 0x0002  // 读写模式
int O_APPEND = 0x0008  // 追加写入
int O_CREAT  = 0x0200  // 如果文件不存在则创建
int O_EXCL   = 0x0800  // 与 O_CREAT 一起使用,文件必须不存在
int O_TRUNC  = 0x0400  // 打开文件时清空内容
```

### 文件描述符
```nature
int STDIN_FILENO  = 0  // 标准输入
int STDOUT_FILENO = 1  // 标准输出
int STDERR_FILENO = 2  // 标准错误
```

### 文件类型掩码
```nature
u32 S_IFMT   = 0o170000  // 文件类型位掩码
u32 S_IFBLK  = 0o060000  // 块设备
u32 S_IFCHR  = 0o020000  // 字符设备
u32 S_IFDIR  = 0o040000  // 目录
u32 S_IFIFO  = 0o010000  // FIFO
u32 S_IFREG  = 0o100000  // 普通文件
u32 S_IFLNK  = 0o120000  // 符号链接
u32 S_IFSOCK = 0o140000  // 套接字
```

### 网络协议族
```nature
int AF_INET  = 0x2   // IPv4 协议
int AF_INET6 = 0xa   // IPv6 协议
int AF_UNIX  = 0x1   // Unix 域套接字
```

### 套接字类型
```nature
int SOCK_STREAM    = 0x1  // TCP 流式套接字
int SOCK_DGRAM     = 0x2  // UDP 数据报套接字
int SOCK_RAW       = 0x3  // 原始套接字
int SOCK_SEQPACKET = 0x5  // 有序分组套接字
```

## 类型

### stat_t
文件状态信息结构体。

```nature
type stat_t = struct {
    u64 dev         // 设备 ID
    u64 ino         // inode 号
    u32 mode        // 文件模式
    u32 nlink       // 硬链接数
    u32 uid         // 用户 ID
    u32 gid         // 组 ID
    u64 rdev        // 设备类型
    i64 size        // 文件大小
    i64 blocks      // 已分配的块数
    i32 blksize     // 块大小
    timespec_t atim // 最后访问时间
    timespec_t mtim // 最后修改时间
    timespec_t ctim // 最后状态改变时间
}
```

### sockaddr_in
IPv4 套接字地址结构。

```nature
type sockaddr_in = struct {
    u16 sin_family        // 地址族(AF_INET)
    u16 sin_port         // 端口号
    u32 sin_addr         // IPv4 地址
    arr<u8,8> sin_zero   // 填充字节
}
```

### sockaddr_in6  
IPv6 套接字地址结构。

```nature
type sockaddr_in6 = struct {
    u16 sin6_family      // 地址族(AF_INET6)
    u16 sin6_port        // 端口号
    u32 sin6_flowinfo    // 流信息
    arr<u32,4> sin6_addr // IPv6 地址
    u32 sin6_scope_id    // 作用域 ID
}
```

## 函数

### 文件操作

#### open()
打开文件。

```nature
fn open(string filename, int flags, u32 perm):int!
```

#### read()
从文件描述符读取数据。

```nature
fn read(int fd, void_ptr buf, int len):int!
```

#### write() 
向文件描述符写入数据。

```nature
fn write(int fd, void_ptr buf, int len):int!
```

#### close()
关闭文件描述符。

```nature
fn close(int fd):void!
```

#### stat()
获取文件状态信息。

```nature
fn stat(string filename):stat_t!
```

### 进程控制

#### fork()
创建子进程。

```nature
fn fork():int!
```

#### exec()
执行新程序。

```nature
fn exec(string path, [string] argv, [string] envp):void!
```

#### exit()
终止当前进程。

```nature
fn exit(int status):void!
```

#### kill()
向进程发送信号。

```nature
fn kill(int pid, int sig):void!
```

### 网络操作

#### socket()
创建套接字。

```nature
fn socket(int domain, int t, int protocol):int!
```

#### bind()
绑定套接字地址。

```nature
fn bind<T>(int sockfd, T addr):void!
```

#### listen()
监听连接。

```nature
fn listen(int sockfd, int backlog):void!
```

#### accept()
接受连接。

```nature
fn accept<T>(int sockfd, ptr<T> addr):int!
```

## 使用示例

`import syscall`

### 文件操作示例
```nature
// 读取文件状态
var st = syscall.stat("test.txt")
println(st.size)  // 输出文件大小
```

## 注意事项
1. 所有系统调用都可能失败,需要进行错误处理
2. 文件描述符使用完毕后必须手动关闭
3. 不同操作系统的系统调用可能存在差异

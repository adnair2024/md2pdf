#   Core Concepts
-   C was developed to write UNIX
-   Kernel is the core of the UNIX System
-   Shell is the programmable/interchangeable user interface in the system
    -   Separate from kernel
-   Privileged vs Unprivileged
    -   Privileged commands are ones run by kernel (sudo)
    -   Unprivileged commands are ones run by the user (ls)
-   User Processes
    -   A process is a representation of a running user program managed by the kernel
    -   Processes can have many threads
-   Environment List (or Variables)
    -   Set of variables and values passed to new Processes
-   UNIX Directory Hierarchy
-   Kernel -> Shell -> Users and Groups
##  What is System Programming?
```c
/* hello_word.c */
#include <stdio.h> // Angle brackets mean that lib stored in default place for the OS

void main()
{
    printf("hello, world\n");
}
```
-   Header file includes function **declarations**, the function definition is stored in .C file

##  Magic input and output
```c
/* hello.c */
#include <stdio.h>
void main() {
    char username[256]; // Creates a username variable for the user to store their name in (255 byte length)
    printf("Enter your name: "); // Prompts user for name
    scanf("%255s", username); // Stores username in the "username" variable
    printf("hello, %s\n", username); // Prints out hello, ashwin (using format specifier)
}
```
### `scanf`
-   The `f` in `scanf` stands for formatted input
-   Reads input from the keyboard, following user provided format
-   `%255s` means input data should be stored as a string with a max width of 255 characters, 
    followed by a null byte (\0)
-   The argument that comes after the format specifier must be a pointer to the beginning of a char array
    that is large enough to hold 255 characters, plus a null byte.
-   Array names can be used in C wherever a constant pointer is expected, so the array `username` is a valid argument

##  Role of C library in I/O
-   When processing a file, and a compiler finds a function call not defined in the same file, it 
    marks the call as an unresolved symbol.
-   Same happens when it finds unknown type names, variable names, etc.
-   "Linking" is the act of assigning addresses to these unresolved symbols.
    -   The compiler does not link
    -   The linker is a component of the compiler collections that resolves undefined symbols.
    -   A *compiler collection* is a set of programs that build programs from the source code.

##  System Resources
-   Resources are objects that software uses and/or modifies
    -   A program's input and output and data are resources, and as are values stored in internal data structures
-   Resources that only the system can use are called system resources
    -   Hardware
        -   CPU
        -   Physical memory
        -   Screen displays
        -   Storage devices
        -   Network connections
    -   Soft resources
        -   System data structures
        -   System Files
-   The API that an operating system provides in effect defines the means by which an application can request
    services from it. The functions in the API are called *system calls*
-   A program that makes direct requests for the services exposed in an operating system's API is called a
    *system program*, and programming involved in creating these programs is called *system programming*
-   System programs make requests for resources and services directly from the OS
##  Unix Kernel
-   Operating system has no universal definition, but below are two:
    -   The operating system is the collection of all software that provides services to apps and users,
        and manages and protects all hardware resources. In this view, tools like user interfaces and browsers
        are part of the operating system
    -   The operating system is the only program that is loaded into memory on startup and remains in memory,
        controlling all computer resources, until the computer is powered off - *Also the definition for Kernel*
-   Kernel is a program, or collection of interacting programs, with many entry points. 
    -   An entry point is an instruction in a program at which execution can begin. Each of these entry points
        provides a service that the kernel performs.
    -   Software libraries are code modules with multiple entry points.
    -   Entry points -> functions that can be called by other programs.
-   You can think of a kernel as a collection of separate functions, bundled together into a large package, and 
    the API as a collection of signatures or prototypes of these functions.
##  Kernel's Roles and Responsibilities
-   When a UNIX system boots, a combination of firmware and software loads the kernel into the portion of memory
    called *system space*, where it stays until the machine shuts down.
    -   User applications are not allowed to access system space; if they do, the kernel terminates them.
-   Kernel has full access to all hardware connected to the computer
-   If a user's running program wants to read or write to a disk, it must ask the kernel to do that on it's behalf;
    it cannot do it on its own. The kernel will perform the task and transfer any data to or from a portion
    of memory that the user's program can access.
-   Kernel services
    -   Process scheduling and management
    -   I/O handling
    -   Physical and virtual memory management
    -   Device management
    -   File system management
    -   Signaling and interprocess communication
    -   Multithreading
    -   Protection and security
    -   Networking services
##  Shell and Commands
-   Options modify the behavior of a command, while arguments are the input for the command.
`gcc -g -o myprog myprog.c`
-   `gcc` -> command name (GNU Compiler Collection)
-   `-g` -> An option to gcc that tells it to include debugging info
-   `-o myprog` -> An option with an option argument `myprog`. The option -o tells gcc to put the output 
    into the file names immediately after it, in this case, *myprog*, which is its argument.
-   `myprog.c` -> The command's only argument.
-   In GNU/Linux and some other UNIX systems, some commands have two kinds of command options:
    -   Short: Short options begin with a single dash (-) and are a single character (like -o)
    -   Long: Long options begin with two dashes (--) and can be words like --date or --file-type
---
#   Homework
- [x] POSIX.1-2024
    -   POSIX provides a set of specifications for programs running on different operating systems 
        to ensure compatibility. Adhering to POSIX ensures that your program can run across 
        various operating systems, with little to no modifications. It's also known as IEEE 
        Standard 1003.1-2024.
        -   Example: `read()`, etc

---
##  Shells
-   `shell builtins` - command built into the shell
    -   Will call a new function without starting a new process
    -   Building a command directly from the shell speeds up the execution
-   First ever shell was the Bourne Shell (called sh)
    -   We use Bourne Again SHell (or bash) in this book
##  Users and Groups
-   Traditional method of authentication on Unix gives every user a unique username and an 
    associated unique UID (integer).
-   Each user also has a password; if password is non-existent or wrong, login is rejected.
-   System files store passwords in encrypted form.
-   A user is any entity that can run programs and own files. **This entity does not
    need to be an actual person**.
    -   Example: `root`, `syslog`
-   A group is a set of users. Like as each user has a username and a UID, each group has
    a group name and an associated unique non-negative integer GID (group ID).
-   Groups exist for resource sharing.
-   Every user belongs to atleast one group, called the *primary group.*
-   *Superuser* in Unix has complete control over the device
    -   Usually called `root`
    -   Unix systems usually record every login attempt for root
##  Privileged and Nonprivileged Instructions
-   Unix requires that the processor supports two modes of operation:
    -   *Privileged* Mode - Also known as supervisor mode
    -   *Nonprivileged* Mode - Also known as user mode 
-   Only the kernel is allowed to execute privileged instructions. Programs run by normal
    users can only execute nonprivileged instructions.
##  Environments
-   When a program is executed in Unix, the kernel makes available to the program an array
    of name-value pairs called the environment list. This is done before the program 
    executes.
    -   Each name-value pair in this list is a string of the form `name=value`, where 
    *value* is a NULL-terminated C string and there are no spaces around the `=` 
    character.
        -   For portability of the programs using these variables, they should only contain
            uppercase letters, digits and underscores. It should also not begin with a 
            digit.
-   `printenv` -> displays all environment variables
##  Files, Directories, and the Single Directory Hierarchy
-   Very first aspect of UNIX that was designed was the file system.
    -   Ritchie and Thompson said everything in the UNIX system is a file.
### Files
-   Files live in *nonvolatile* storage devices, like hard drives.
    -   These are called secondary storage or external storage devices.
        -   Example: Hard Drive, SSD
-   Primary storage devices are usually *volatile* storage devices, which only 
    keep data when power is supplied to them.
    -   Example: Main Memory
-   Regular/plain files
    -   Some are called textfiles.
    -   Files contain sequences of characters and newline characters.
    -   User or program provides structure.
-   Binary files
    -   Files that contain sequences of bytes (not text characters), possibly executable code.
### File Types
-   Small set of file types besides regular files:
    -   Directories
    -   Device Files
    -   Pipes
    -   Sockets
    -   Symbolic Links
-   Special files include Device Files, Pipes and Sockets. 
    -   Special files are unique to UNIX
### File Attributes, Permissions and Contents
-   Attributes are important information pertaining to a file. They include:
    -   Time file was last modified
    -   Time file was last accessed
    -   File size (in bytes)
    -   Who can access the file, etc.
-   Attributes related to restriction on file access are called the file mode or *file's permissions*
    -   Permissions are an important part of security on UNIX systems
-   A file's attributes are sometimes referred to as *metadata*, or a file's *status*
-   Difference between metadata and contents of a file:
    -   Metadata is info *about* a file 
    -   Contents is the data stored by a file
-   Some files (like certain special files) do not store any data; they are just interfaces used by the
    kernel to implement device-independent input and output.
-   Contents and metadata aren't stored together; the metadata is stored in an *inode* (data structure), while 
    the contents is spread out on multiple blocks on the same storage device as the inode.
### Directories
-   Users might think that directories contain other files, but they don't.
-   Directories can be likened to a table of contents.
-   **A directory is a file that contains links, or directory entries.**
    -   A link is an object that associates a filename to an actual file.
        -   Links have two components;
            -   The filename
            -   Reference to the file's inode
    -   Links may reference any type of file, including directories. 
    -   This implies that directories can be members of other directories.
    -   A link isn't allowed to refer to a file that is not on the same device as the directory itself.
-   A directory is never empty, since it will always continue the following:
    -   .
        -   This is a link to the directory itself
    -   ..
        -   This is a link to the parent directory

-   | Reference to file | Name |
    | --- | --- | 
    | 53 | . | 
    | 2 | .. | 
    | 12 | *kernel* |
    | 185 | *drivers* | 
    | 282 | *README* |

-   Current working directory is the one you're currently working in.

-   ```bash // ls to list contents of directories
    ❯ ls Books go
    Books:
    Flatmate  'I, Q'

    go: 
    bin  pkg
    ```

-   ```bash // cd to change directory:
    ❯ cd go 
    ~/go ❯ 
    ```

-   ```bash // cd .. to return to parent directory
    ~/go ❯ cd ..
    ~ ❯ 
    ```
### Filenames
-   Files and filenames are not the same thing
    -   A `filename` is a string that names a file. It is a part of the link contained within the directory.
    -   A single nondirectory file may have names in different directories on the same logical device.
        -   This means that a single file can appear as a member in multiple different directories.
    -   If the same file has names in different directories, the references associated with those names point to the
        exact same inode.
    -   Like a person traveling with different passports, because they may have different names, but it all refers to 
        the same person.
-   Unix does not use filename extensions for any purpose
    -   Some user-level software (like compilers and word processors) might use them as guides.
    -   Desktop environments like KDE can create associations based on filename extensions like Mac and Windows,
        but Unix does not have a notion of file-type based on content.
    -   Provides same set of operation *regardless of their type*.
    -   In Unix, the file extension (or what comes after the period) is referred to as a suffix.
### Directory Hierarchy
-   The tree-like hierarchy that Unix uses to organize files is called a *directory hierarchy*
-   Many people call this a *filesystem*, but thats wrong.
-   Each node in this hierarchy is either a nondirectory file or a directory. 
-   Each edge in this nonempty directory to each file within the directory is called a *directed edge*.
-   The files within a directory are called *children*, and the directory which houses the children
    are called *parents*.
-   The base directory in a hierarchy is called the *root directory*, even though it's denoted with a "/"
    character.
-   Since a single file can have many names in different directories, a file may have more than one parent node.
    -   **This is why the hierarchy is tree-like but not a tree, since in a tree every node has a unique parnet**
-   The directory hierarchy is a *directed acyclic graph* in most Unix systems
-   It has no cycles because a directory can't have more than one name. This means that no edge
    can be pointing to it from any descendent nodes.
    -   This is why there are no cycles.
-   This single directory hierarchy is a defining characteristic of Unix.
    -   Windows has separate directory hierarchies for each distinct device.
    -   In Unix, even though the files in this tree might be on different devices, they can be attached to the 
        tree with a process called  *mounting*.
        -   After mounting, you can access all files the same way you access files on the base device.
-   ```bash
    Hierarchy Example
    /
        etc
            hosts
        bin
        dev
        home
            fac
                sweiss
        lib
        mnt 
        tmp 
        usr 
            bin 
            local 
        var 
            log 
            tmp
    ```
-   Top level directories usually found in Unix
    -   *Only required directories in POSIX.1-2024 are `/dev/` and `/tmp/`.*
    -   `bin`   -   Essential Binary Executables
    -   `boot`  -   Static bootloader files
    -   `dev`   -   Essential device files
    -   `etc`   -   Almost all host config files
    -   `home`  -   All users' home directories (if present)
    -   `lib`   -   Essential shared libraries and kernel modules
    -   `media` -   Mount point for removable media
    -   `mnt`   -   Mount point for temporarily mounting a file system
    -   `opt`   -   Add-on app software packages
    -   `sbin`  -   Essential system binaries
    -   `srv`   -   Data for services provided by the system
    -   `tmp`   -   Temporary files created by applications
    -   `usr`   -   Was originally the top of the hierarchy for user data files,
                    but now its the top of the hierarchy for nonessential binaries, libraries and sources.
    -   `var`   -   Variable files, meaning files whose contents can change
-   All files (including directories) can be characterized by two binary properties:
    -   Shareability
        -   Shareable files can be stored on one host and used on others
            -   Files in home directories are shareable because they don't depend on where they are stored
        -   Unshareable files aren't shareable
            -   Bootloader files are specific to a given device, so they aren't shareable.
    -   Variability
        -   Variable files are files which contents can change
            -   `/var/` contains log files and other files that are frequently changed, so they're variable
        -   Static files are files which contents cannot change
            -   `/etc/` contains config files that are only changed by software updates, or 
                by the superuser.
    -   In modern Unix systems, the shareability and variability of files determines which ones are
        in which parts of the hierarchy
### Symbolic Links
-   An ordinary (hard) link is a directory entry that points to the inode for a file
-   A symbolic (soft) link is a file whose contents are just the *name* of another file
-   The file a link points to is called a target
-   A symbolic link is similar to a Windows shortcut
-   If you give a program or command a symbolic link as the argument, it will act on the target of the
    link and not the link itself.
    -   When a link is opened to access it's target, we call that dereferencing.
-   Symbolic links can be hazardous because they pose the danger of infinite loops
    -   If a symbolic link points to a directory, it might return to a directory it already visited, and end up 
        in a loop.
### Pathnames
-   Two kinds of path names:
    -   Absolute - Starts at the root directory and starts with a leading slash
    -   Relative - Pathname that does not begin with a forward slash, starts in the CWD
-   Terminating a pathname with a slash is okay if the last filename in it is a directory, like `/usr/bin/`
-   Accidental slashes are ignored in pathnames
-   CWD is defined as the directory that any program uses to resolve pathnames that don't begin with a /
-   ```bash
    
    ~ ❯ pwd
    /home/ashwin

    ~ ❯ printenv PWD
    /home/ashwin
    ```
-   Pathnames can become very long if they contain symbolic links, so Unix systems limit their length
    -   POSIX.1-2024 specifies that the constant `PATH_MAX` is the maximum number of bytes allowed within a 
        pathname, including the terminating `NULL` byte.
    -   In many Linux Systems, it is 4096 bytes.

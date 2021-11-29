#include <stdio.h>

int main(int argc, char const *argv[])
{
    int x = 3, y = 3, z = 1;
    printf("%d,%d,%d,%d", (++x, y++), (z + x + y + 2),y,x);
    return 0;
}

#include<iostream>
#include<iomanip>
using namespace std;
int main()
{
    int r;int c;
    cout<<"Enter number of rows and columns ";
        cin>>r>>c;
    int arr[r][c];
    cout<<"Enter elements row wise ";

    for(int i=0;i<r;i++)
    {
        for(int j=0;j<c;j++)
        {
            cin>>arr[i][j];
        }
    }
    int k,temp=1,max=r*c;
    cout<<"Elements of matrix in spiral form: ";

    for(int i=0;i<r/2+1;i++)
    {
        if(temp<=max){
            k=0+i;
         for(int j=0+i;j<=c-i-1;j++)
        {
            cout<<arr[k][j]<<" ";
            temp++;
        }
        }
        if(temp<=max){
           k=c-i-1;
         for(int j=0+i+1;j<r-i;j++)
        {
            cout<<arr[j][k]<<" ";
            temp++;
        }
        }
        if(temp<=max){
        k=r-i-1;
        for(int j=c-i-2 ;j>0+i-1;j--)
        {
            cout<<arr[k][j]<<" ";
            temp++;
        }
        }
        if(temp<=max){
        k=0+i;
         for(int j=r-i-2;j>0+i;j--)
        {
            cout<<arr[j][k]<<" ";
            temp++;
        }
        }


    }
}

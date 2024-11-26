#include<iostream>
#include <string>
#include <vector>
#include <queue>
#include <fstream>
#include<cstring>
#include<sstream>
#include <typeinfo>
#include<windows.h>

using namespace std;

//Defining Huffman Tree Node
struct Node {
    char data;
    unsigned freq;
    string code;
    Node *left, *right;

    Node() {
        left = right = NULL;
    }
};

class huffman {
private:
    vector <Node*> arr;

    fstream inFile, outFile;

    string inFileName, outFileName;

    Node *root;

    class Compare {
        public:
            bool operator() (Node* l, Node* r)
            {
                return l->freq > r->freq;
            }
    };

    priority_queue <Node*, vector<Node*>, Compare> minHeap;

    //Initializing a vector of tree nodes representing character's ASCII value and initializing its frequency with 0
    void createArr();

    //Traversing the constructed tree to generate huffman codes of each present character
    void traverse(Node*, string);

    //Function to convert binary string to its equivalent decimal value
    int binToDec(string);

    //Function to convert a decimal number to its equivalent binary string
    string decToBin(int);

    //Reconstructing the Huffman tree while Decoding the file
    void buildTree(char, string&);

    //Creating Min Heap of Nodes by frequency of characters in the input file
    void createMinHeap();

    //Constructing the Huffman tree
    void createTree();

    //Generating Huffman codes
    void createCodes();

    //Saving Huffman Encoded File
    void saveEncodedFile();

    //Saving Decoded File to obtain the original File
    void saveDecodedFile();

    //Reading the file to reconstruct the Huffman tree
    void getTree();

public:
    //Constructor
    huffman(string inFileName, string outFileName)
    {
        this->inFileName = inFileName;
        this->outFileName = outFileName;
        createArr();
    }
    //Compressing input file
    void compress();
    //Decompressing input file
    void decompress();
};

void huffman::createArr()
{
    for (int i = 0; i < 128; i++) {
        arr.push_back(new Node());
        arr[i]->data = i;
        arr[i]->freq = 0;
    }
}

void huffman::traverse(Node* r, string str)
{
    if (r->left == NULL && r->right == NULL) {
        r->code = str;
        return;
    }

    traverse(r->left, str + '0');
    traverse(r->right, str + '1');
}

int huffman::binToDec(string inStr)
{
    int res = 0;
    for (auto c : inStr) {
        res = res * 2 + c - '0';
    }
    return res;
}

string huffman::decToBin(int inNum)
{
    string temp = "", res = "";
    while (inNum > 0) {
        temp += (inNum % 2 + '0');
        inNum /= 2;
    }

    res.append(8 - temp.length(), '0');
    for (int i = temp.length() - 1; i >= 0; i--) {
        res += temp[i];
    }

    return res;
}

void huffman::buildTree(char a_code, string& path)
{
    Node* curr = root;

    for (int i = 0; i < path.length(); i++)
    {
        if (path[i] == '0')
        {
            if (curr->left == NULL) {
                curr->left = new Node();
            }
            curr = curr->left;
        }
        else if (path[i] == '1')
        {
            if (curr->right == NULL) {
                curr->right = new Node();
            }
            curr = curr->right;
        }
    }

    curr->data = a_code;
}

void huffman::createMinHeap()
{
    char id;
    inFile.open(inFileName, ios::in);
    inFile.get(id);

    //Incrementing frequency of characters that appear in the input file
    while (!inFile.eof())
    {
        arr[id]->freq++;
        inFile.get(id);
    }
    inFile.close();

    //Pushing the Nodes which appear in the file into the priority queue (Min Heap)
    for (int i = 0; i < 128; i++)
    {
        if (arr[i]->freq > 0)
            minHeap.push(arr[i]);
    }
}

void huffman::createTree()
{
    //Creating Huffman Tree with the Min Heap created earlier
    Node *left, *right;
    priority_queue <Node*, vector<Node*>, Compare> tempPQ(minHeap);

    while (tempPQ.size() != 1)
    {
        left = tempPQ.top();
        tempPQ.pop();

        right = tempPQ.top();
        tempPQ.pop();

        root = new Node();
        root->freq = left->freq + right->freq;

        root->left = left;
        root->right = right;
        tempPQ.push(root);
    }
}

void huffman::createCodes()
{
    //Traversing the Huffman Tree and assigning specific codes to each character
    traverse(root, "");
}

void huffman::saveEncodedFile()
{
    //Saving encoded (.huf) file
    inFile.open(inFileName, ios::in);
    outFile.open(outFileName, ios::out | ios::binary);
    string in = "";
    string s = "";
    char id;

    //Saving the meta data (huffman tree)
    in += (char)minHeap.size();
    priority_queue <Node*, vector<Node*>, Compare> tempPQ(minHeap);

    while (!tempPQ.empty()) {
        Node* curr = tempPQ.top();
        in += curr->data;

        //Saving 16 decimal values representing code of curr->data
        s.assign(127 - curr->code.length(), '0');
        s += '1';
        s += curr->code;

        //Saving decimal values of every 8-bit binary code
        in += (char)binToDec(s.substr(0, 8));

        for (int i = 0; i < 15; i++)
        {
            s = s.substr(8);
            in += (char)binToDec(s.substr(0, 8));
        }
        tempPQ.pop();
    }
    s.clear();

    //Saving codes of every character appearing in the input file
    inFile.get(id);
    while (!inFile.eof())
    {
        s += arr[id]->code;
        //Saving decimal values of every 8-bit binary code
        while (s.length() > 8)
        {
            in += (char)binToDec(s.substr(0, 8));
            s = s.substr(8);
        }
        inFile.get(id);
    }

    //Finally if bits remaining are less than 8, append 0's
    int count = 8 - s.length();
	if (s.length() < 8)
    {
		s.append(count, '0');
	}
	in += (char)binToDec(s);
    //append count of appended 0's
    in += (char)count;

    //write the in string to the output file
	outFile.write(in.c_str(), in.size());
	inFile.close();
	outFile.close();
}

void huffman::saveDecodedFile()
{
    inFile.open(inFileName, ios::in | ios::binary);
    outFile.open(outFileName, ios::out);
    unsigned char size;
    inFile.read(reinterpret_cast<char*>(&size), 1);

    //Reading count at the end of the file which is number of bits appended to make final value 8-bit
    inFile.seekg(-1, ios::end);
    char count0;
    inFile.read(&count0, 1);

    //Ignoring the meta data (huffman tree) (1 + 17 * size) and reading remaining file
    inFile.seekg(1 + 17 * size, ios::beg);

    vector<unsigned char> text;
    unsigned char textseg;
    inFile.read(reinterpret_cast<char*>(&textseg), 1);

    while (!inFile.eof())
    {
        text.push_back(textseg);
        inFile.read(reinterpret_cast<char*>(&textseg), 1);
    }

    Node *curr = root;
    string path;
    for (int i = 0; i < text.size() - 1; i++)
    {
        //Converting decimal number to its equivalent 8-bit binary code
        path = decToBin(text[i]);
        if (i == text.size() - 2)
        {
            path = path.substr(0, 8 - count0);
        }

        //Traversing huffman tree and appending resultant data to the file
        for (int j = 0; j < path.size(); j++)
        {
            if (path[j] == '0') {
                curr = curr->left;
            }
            else {
                curr = curr->right;
            }

            if (curr->left == NULL && curr->right == NULL) {
                outFile.put(curr->data);
                curr = root;
            }
        }
    }
    inFile.close();
    outFile.close();
}

void huffman::getTree()
{
    inFile.open(inFileName, ios::in | ios::binary);
    //Reading size of MinHeap
    unsigned char size;
    inFile.read(reinterpret_cast<char*>(&size), 1);
    root = new Node();

    //next size * (1 + 16) characters contain (char)data and (string)code[in decimal]
    for(int i = 0; i < size; i++)
    {
        char aCode;
        unsigned char hCodeC[16];
        inFile.read(&aCode, 1);
        inFile.read(reinterpret_cast<char*>(hCodeC), 16);

        //converting decimal characters into their binary equivalent to obtain code
        string hCodeStr = "";
        for (int i = 0; i < 16; i++)
        {
            hCodeStr += decToBin(hCodeC[i]);
        }

        //Removing padding by ignoring first (127 - curr->code.length()) '0's and next '1' character
        int j = 0;
        while (hCodeStr[j] == '0')
        {
            j++;
        }
        hCodeStr = hCodeStr.substr(j+1);
        //Adding node with aCode data and hCodeStr string to the huffman tree
        buildTree(aCode, hCodeStr);
    }
    inFile.close();
}

void huffman::compress()
{
    createMinHeap();
    createTree();
    createCodes();
    saveEncodedFile();
}

void huffman::decompress()
{
    getTree();
    saveDecodedFile();
}

bool fileExists(const std::string& fileName) {
    std::ifstream file(fileName);
    return file.good();
}



void encryptFile(string input,string encryptedFile)
{
    //encryption of text data
    ifstream File;

    //clearing encryption.txt before editing
    File.open(encryptedFile.c_str(), std::ifstream::out | std::ifstream::trunc );
    if (!File.is_open() || File.fail())
    {
        File.close();
        printf("\nError : failed to erase file content !");
    }
    File.close();

    //reading plain text from input.txt
    fstream newfile;
    newfile.open(input,ios::in); //open a file to perform read operation using file object

    if (newfile.is_open()){   //checking whether the file is open
        cout << "Reading plain text from " << input << " .........\n";
        Sleep(1000);
        string tp;
        int key;
        cout << "Enter key to encrypt text : ";
        cin >> key;
        cout << "Now encrypting ....\n";
        Sleep(1000);
        cout << "writing encrypted data in " << encryptedFile << " ..\n";
        Sleep(1000);
        cout<<endl;
        while(getline(newfile, tp))
        {
            //read data from file object and put it into string.
            string outputtext="";
            int messlength=tp.length();
            int i=0;
            while(tp[i]!='\0')
            {
                outputtext += tp[i]+key;
                i++;
            }
            //storing our encrypted data in encryption.aes
            ofstream fout;  // Create Object of Ofstream
            ifstream fin;
            fin.open(encryptedFile);
            fout.open (encryptedFile,ios::app); // Append mode
            if(fin.is_open())
                fout<< outputtext <<"\n"; // Writing data to file
            fin.close();
            fout.close();
        }
        cout << "Caesar Cipher encryption is done successfully \n";
        cout << "Data has been appended to file " << encryptedFile << endl;
        newfile.close(); //close the file object.
    }
}

void decryptFile(string output,string encryptedFile)
{
    cout << "Reading encrypted data from " << encryptedFile << " .........\n";
    Sleep(1000);
    string tp;
    int key;
    cout << "Enter decryption key : ";
    cin >> key;
    cout << "Now Decrypting ....\n";
    Sleep(1000);
    cout << "Writing decrypted data in " << output << " ..\n";
    Sleep(1000);
    cout << endl;
    cout << "Following is our decrypted text:- \n";

    //clearing output file
    ifstream File;

    File.open(output.c_str(), std::ifstream::out | std::ifstream::trunc );
    if (!File.is_open() || File.fail())
    {
        File.close();
        cout << "\nError : failed to erase file content !";
    }

    File.close();
    //storing output text in output text file
    string myText;
    ifstream MyReadFile;
    MyReadFile.open(encryptedFile, ios::in | ios::binary);
    if(MyReadFile.is_open())
    {
        while( getline (MyReadFile, myText))
        {
            string outputtext="";
            int messlength=myText.length();
            int i=0;
            while ( myText[i]!='\0' )
            {
                outputtext += myText[i]-key;
                i++;
            }
            cout << outputtext.substr(0,messlength-1) << endl << endl;
            ofstream fout;  // Create Object of Ofstream
            ifstream fin;
            fin.open(output);
            fout.open (output,ios::app); // Append mode

            if(fin.is_open())
                fout << outputtext.substr(0,messlength-1) << endl << endl; // Writing data to file
            fin.close();
            fout.close();
        }

        cout << "Plain text has been appended to file " << output << endl;
        //close the file object.
        MyReadFile.close();
    }
}

// This function is responsible for compressing a file using Huffman coding.
void compress()
{
    string input,compressedFile;
    // Get the names of the input file and the compressed file from the user.
    cout << "Enter the name of the input file (without including extension ('.txt')): ";
    cin >> input;
    cout << "Enter the name of the compressed file (without including extension ('.huf')): ";
    cin >> compressedFile;

    if (fileExists(input + ".txt"))
    {
        // Create an instance of the Huffman class and call its compress method.
        huffman f( input + ".txt", compressedFile + ".huf");
        f.compress();

        // Inform the user that the compression is successful.
        cout << "Compressed successfully" << endl;
    }
    else
        cout << input << ".txt file does not exist!!!" << endl;
}

// This function is responsible for decompressing a file using Huffman coding.
void decompress()
{
    string output,compressedFile;
    // Get the names of the compressed file and the output file from the user.
    cout << "Enter the name of the compressed file (without including extension ('.huf')): ";
    cin >> compressedFile;
    cout << "Enter the name of the output file (without including extension ('.txt')): ";
    cin >> output;

    if (fileExists(compressedFile + ".huf"))
    {
        // Create an instance of the Huffman class and call its decompress method.
        huffman f( compressedFile + ".huf", output + ".txt");
        f.decompress();

        // Inform the user that the decompression is successful.
        cout << "Decompressed successfully" << endl;
    }
    else
        cout << compressedFile << ".huf file does not exist!!!" << endl;
}

// This function is responsible for encrypting a file using a custom encryption algorithm.
void encrypt()
{
    string input,encryptedFile;
    // Get the names of the input file and the encrypted file from the user.
    cout << "Enter the name of the input file (without including extension ('.txt')): ";
    cin >> input;
    cout << "Enter the name of the encrypted file (without including extension ('.txt')): ";
    cin >> encryptedFile;

    // Call the encryptFile function to encrypt the input file.
    if (fileExists(input + ".txt"))
        encryptFile(input + ".txt", encryptedFile + ".txt");
    else
        cout << input << ".txt file does not exist!!!" << endl;
}

// This function is responsible for decrypting a file using the same custom encryption algorithm used in encrypt().
void decrypt()
{
    string output,encryptedFile;
    // Get the names of the encrypted file and the output file from the user.
    cout << "Enter the name of the encrypted file (without including extension ('.txt')): ";
    cin >> encryptedFile;
    cout << "Enter the name of the output file (without including extension ('.txt')): ";
    cin >> output;

    // Call the decryptFile function to decrypt the encrypted file.
    if (fileExists(encryptedFile + ".txt"))
        decryptFile(output + ".txt", encryptedFile + ".txt");
    else
        cout << encryptedFile << ".txt file does not exist!!!" << endl;
}

int main()
{
    int ch;
    while (1)
    {
        int ch;
        // Display the menu to the user.
        cout << "1. Compress a file" << endl;
        cout << "2. Decompress a file" << endl;
        cout << "3. Encrypt a file" << endl;
        cout << "4. Decrypt a file" << endl;
        cout << "5. Quit" << endl;
        cout << "Enter your choice : ";
        cin >> ch;

        // Call the appropriate function based on the user's choice.
        switch (ch)
        {
            case 1: compress();
                    break;
            case 2: decompress();
                    break;
            case 3: encrypt();
                    break;
            case 4: decrypt();
                    break;
            case 5: cout << "Thanks for joining!!!!" << endl;
                    return 0;
            default:cout << "Invalid input!!!" << endl;
                    cout << "Please input a valid choice!!" << endl;
                    break;
        }
        system("pause");
        system("CLS");
    }
    return 0;
}


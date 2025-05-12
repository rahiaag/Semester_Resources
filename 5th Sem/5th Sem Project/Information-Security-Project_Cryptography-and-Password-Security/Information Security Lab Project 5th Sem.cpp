#include <iostream>
#include <bits/stdc++.h>
#include <time.h>
#include <cmath>
#include <cstring>
#include <conio.h>
#include <map>
#include <direct.h>

using namespace std;

string customAlphabetCaesarEncode(const string &alphabet, int shift, const string &message)
{
 string result = "";
    for (char c : message)
    {
        if (isalpha(c))
        {
            char upperC = toupper(c);
            size_t pos = alphabet.find(upperC);
            if (pos != string::npos)
            {
                char newChar = alphabet[(pos + shift) % alphabet.length()];
                result += islower(c) ? tolower(newChar) : newChar;
            }
            else
            {
                result += c; // if not found in the alphabet, leave it unchanged
            }
        }
        else
        {
            result += c; // non-alphabetic characters remain unchanged
        }
    }
    return result;
}

string customAlphabetCaesarDecode(const string &alphabet, int shift, const string &message)
{
     string result = "";
    for (char c : message)
    {
        if (isalpha(c))
        {
            char upperC = toupper(c);
            size_t pos = alphabet.find(upperC);
            if (pos != string::npos)
            {
                char newChar = alphabet[(pos - shift + alphabet.length()) % alphabet.length()];
                result += islower(c) ? tolower(newChar) : newChar;
            }
            else
            {
                result += c; // if not found in the alphabet, leave it unchanged
            }
        }
        else
        {
            result += c; // non-alphabetic characters remain unchanged
        }
    }
    return result;
}

// VERNAM CIPHER
string vernamEncryption(string text, string key)
{
    string cipherText = "";
    int cipher[key.length()];

    for (int i = 0; i < key.length(); i++)
    {
        cipher[i] = text.at(i) - 'A' + key.at(i) - 'A';
    }
    for (int i = 0; i < key.length(); i++)
    {
        if (cipher[i] > 25)
        {
            cipher[i] = cipher[i] - 26;
        }
    }
    for (int i = 0; i < key.length(); i++)
    {
        int x = cipher[i] + 'A';
        cipherText += (char)x;
    }
    return cipherText;
}

static string vernamDecryption(string s, string key)
{
    string plainText = "";
    int plain[key.length()];

    for (int i = 0; i < key.length(); i++)
    {
        plain[i] = s.at(i) - 'A' - (key.at(i) - 'A');
    }
    for (int i = 0; i < key.length(); i++)
    {
        if (plain[i] < 0)
        {
            plain[i] = plain[i] + 26;
        }
    }

    for (int i = 0; i < key.length(); i++)
    {
        int x = plain[i] + 'A';
        plainText += (char)x;
    }

    return plainText;
}

vector<int> generateRandomKey(int length)
{
    vector<int> key1;
    srand(static_cast<unsigned int>(time(nullptr))); // Seed the random number generator with the current time

    for (int i = 0; i < length; ++i)
    {
        key1.push_back(rand() % 26); // assuming 26 letters in the alphabet
    }
    return key1;
}

string xorEncryption(const string &text, int key)
{
    string cipherText;
    for (size_t i = 0; i < text.length(); ++i)
    {
        cipherText += text[i] ^ key;
    }
    return cipherText;
}

string xorDecryption(const string &cipherText, int key)
{
    string decryptedText;
    for (size_t i = 0; i < cipherText.length(); ++i)
    {
        decryptedText += cipherText[i] ^ key;
    }
    return decryptedText;
}

// VIGENÈRE CIPHER

string generateKey(string str, string key)
{
    int x = str.size();

    for (int i = 0;; i++)
    {
        if (x == i)
            i = 0;
        if (key.size() == str.size())
            break;
        key.push_back(key[i]);
    }
    return key;
}

string vigenereEncryption(string str, string key)
{
    string cipher_text;

    for (int i = 0; i < str.size(); i++)
    {
        char x = (str[i] + key[i]) % 26;
        x += 'A';
        cipher_text.push_back(x);
        key = generateKey(str, key);
    }
    return cipher_text;
}

string vigenereDecryption(string cipher_text, string key)
{
    string orig_text;

    for (int i = 0; i < cipher_text.size(); i++)
    {
       char x = ((cipher_text[i] - key[i] + 26) % 26 + 26) % 26 + 'A';
        orig_text.push_back(x);
        key = generateKey(cipher_text, key);
    }
    return orig_text;
}


void PasswordGenerator()
{
    srand(time(0));
    string pass;
    string lower = "abcdefghijklmnopqrstuvwxyz";
    string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    string num = "0123456789";
    string special = "`~@#$%^&*()-_=+\\|{};:',<>./?[]";
    string data = lower + upper + num + special;
    for (int i = 1; i <= 12; i++)
    {
        pass = pass + data[rand() % 88];
    }
    cout << "Password is: " << pass;
}

bool isSpecialChar(char c)
{
    if (int(c) >= 32 && int(c) <= 47)
    {
        return true;
    }
    if (int(c) >= 58 && int(c) <= 64)
    {
        return true;
    }
    if (int(c) >= 91 && int(c) <= 96)
    {
        return true;
    }
    if (int(c) >= 123 && int(c) <= 126)
    {
        return true;
    }
    else
    {
        return false;
    }
}

void PasswordChecker()
{
    string password;
    short nums = 0, capAlphaCnt = 0, specialCharCnt = 0, passLength = 0;
    cout << "Enter your password: ";
    cin >> password;
    if (password.length() >= 8)
    {
        passLength = 1;
    }
    for (int i = 0; i < password.length(); i++)
    {
        if (isupper(password[i]))
        {
            capAlphaCnt++;
        }
        if (isSpecialChar(password[i]))
        {
            specialCharCnt++;
        }
        if (password[i] >= '0' && password[i] <= '9')
        {
            nums++;
        }
    }
    if (capAlphaCnt > 0 && specialCharCnt > 0 && nums > 0 && passLength)
    {
        cout << "STRONG PASSWORD!" << endl;
    }
    else
    {
        cout << "WEAK PASSWORD!" << endl;
    }
}

void exit()
{
    {
        cout << " _______ Thank you for Your Time ___________\n";
        cout << " ";
        cout << " ";
        cout << "\n";
    }
}
int main()
{

    string plainText, ciphertext, decryptedText, keyword;
    int key, n;

    string correctPassword = "PASSWORD123";
    int maxAttempts = 3;
    int attempts = 0;
    string enteredPassword = "";
    char ch;
    vector<int> randomKey(int length);

    do
    {
        cout << "Enter the password: ";
        ch = getch();
        while (ch != 13)
        {
            if (ch == 8)
            {
                if (enteredPassword.length() > 0)
                {
                    cout << "\b \b";
                    enteredPassword.pop_back();
                }
            }
            else
            {
                enteredPassword += ch;
                cout << '*';
            }
            ch = getch();
        }

        cout << endl;

        if (enteredPassword == correctPassword)
        {
            cout << "Password correct. Access granted!" << endl;

            int n = 0;
            do
            {
                cout << "Enter Your Choice" << endl;
                cout << "1. Modified Caesar Cipher" << endl;
                cout << "2. XOR Cipher" << endl;
                cout << "3. Vigenere Cipher" << endl;
                cout << "4. Password Generator" << endl;
                cout << "5. Password Checker" << endl;
                cout << "6. Exit" << endl;

                cout << "Enter Your Choice: ";
                cin >> n;

                switch (n)
                {

                case 1:
                {
                    string message;
                    string alphabet = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
                    int key;
                    cout << "Enter integer key: ";
                    cin >> key;
                    cin.ignore();
                    cout << "Enter the message :" << endl;
                    getline(cin,message);
                    string encodedMessage = customAlphabetCaesarEncode(alphabet, key, message);
                    cout << "Encoded message: " << encodedMessage << endl;
                    string decodedMessage = customAlphabetCaesarDecode(alphabet, key, encodedMessage);
                    cout << "Decoded message: " << decodedMessage << endl;
                    break;
                }

                 case 2:
                    int keyLength;

                    cout << "Enter the key length: ";
                    cin >> keyLength;

                    // randomKey = generateRandomKey(keyLength);

                    cout << "Enter plaintext: ";
                    cin >> plainText;

                    // Encryption
                    ciphertext = xorEncryption(plainText, keyLength);
                    cout << "Encrypted Text: " << ciphertext << endl;

                    // Decryption
                    decryptedText = xorDecryption(ciphertext, keyLength);
                    cout << "Decrypted Text: " << decryptedText << endl;
                    break;

                case 3:
                    cout << "Enter PlainText: ";
                    cin >> plainText;
                    cout << "Enter the string key: ";
                    cin >> keyword;
                    ciphertext = vigenereEncryption(plainText, keyword);
                    cout << "Encrypted Text is: " << ciphertext << endl;
                    decryptedText = vigenereDecryption(ciphertext, keyword);
                    cout << "The Message is: " << decryptedText << endl;
                    break;


                case 4:
                    PasswordGenerator();
                    cout << endl;
                    break;

                case 5:
                    PasswordChecker();
                    cout << "Tip : Add the combination of Special Character, Uppercase, and Numbers" << endl;
                    cout << endl;
                    break;

                case 6:
                    exit();
                    break;

                default:
                    cout << "Invalid choice. Please enter a valid option." << endl;
                    break;
                }

            } while (n != 7);

            break; // Exit the outer loop
        }
        else
        {
            cout << "Incorrect password. Try again." << endl;
            attempts++;

            if (attempts >= maxAttempts)
            {
                cout << "Maximum attempts reached. Computer is going to sleep." << endl;
                system("C:\\Windows\\System32\\shutdown /r /t 0");
                break; // Exit the outer loop
            }
        }
    } while (true);
    return 0;
}

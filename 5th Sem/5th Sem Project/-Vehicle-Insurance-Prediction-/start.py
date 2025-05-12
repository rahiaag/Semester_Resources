import joblib
import pandas as pd
model = joblib.load('random_forest_model.pkl')

def default_dataframe(list1):
    df = pd.Series(0, index=list1)

    df = pd.DataFrame(df).T
    return df
def get_user_input(df):
    predictions = model.predict(df)
    return predictions
def features_list(df,val):
    for i in range(len(val)):
        df.iloc[0][i]=val[i]
    return df
def default_dataframe(feature_list):
    return pd.DataFrame(columns=feature_list)
def features_list(dataframe, values):
    dataframe.loc[len(dataframe)] = values
    return dataframe
if __name__ == "__main__":
    print("Machine Learning Model Predictions")
    
    list1 = ['Age', 'Driving_License', 'Previously_Insured', 'Annual_Premium', 'Vehicle_Age_int', 'gender', 'vehicle_damage']
    df = default_dataframe(list1)

    values = []
    for feature in list1:
        value = input(f"Enter value for {feature}: ")
        values.append(value)

    values = [int(val) if val.isdigit() else float(val) if val.replace('.', '', 1).isdigit() else val for val in values]
    df = features_list(df, values)

    print(df)
    predictions=model.predict(df)
    output=""
    if(predictions[0]==1):
        output="Yes"
    else:
        output="No"
    print("prediction: ",output)